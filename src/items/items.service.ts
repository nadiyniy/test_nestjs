import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { EntityManager, Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { Comment } from './entities/comment.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const listing = new Listing({ ...createItemDto.listing, rating: 0 });
    const tags = createItemDto.tags.map(
      (createTagDto) => new Tag(createTagDto),
    );
    const item = new Item({ ...createItemDto, listing, tags, comments: [] });

    if (!item) throw new BadRequestException('Items not found');

    await this.entityManager.save(item);

    return item;
  }

  async findAll() {
    return this.itemsRepository.find();
  }

  async findOne(id: number) {
    return this.itemsRepository.findOne({
      where: { id },
      relations: { listing: true, comments: true, tags: true },
    });
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    // const item = await this.itemsRepository.findOneBy({ id });
    // if (!item) throw new BadRequestException('Items not found');

    // Object.assign(item, updateItemDto);
    // await this.entityManager.save(item);

    // const comment = updateItemDto.comments.map(
    //   (createCommentDto) => new Comment(createCommentDto),
    // );
    // item.comments = comment;
    // await this.entityManager.save(item);

    // return item;
    await this.entityManager.transaction(async (entityManager) => {
      const item = await this.itemsRepository.findOneBy({ id });
      if (!item) throw new BadRequestException('Items not found');
      Object.assign(item, updateItemDto);
      await entityManager.save(item);
      const comment = updateItemDto.comments.map(
        (createCommentDto) => new Comment(createCommentDto),
      );
      item.comments = comment;
      await entityManager.save(item);

      const tagContent = `${Math.random()}`;
      const tag = new Tag({ content: tagContent });

      await entityManager.save(tag);

      return item;
    });
  }

  async remove(id: number) {
    const item = await this.itemsRepository.findOneBy({ id });
    if (!item) throw new BadRequestException('Items not found');

    await this.entityManager.remove(item);

    return `Item ${item.name} removed`;
  }
}
