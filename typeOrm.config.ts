import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Comment } from 'src/items/entities/comment.entity';
import { Item } from 'src/items/entities/item.entity';
import { Listing } from 'src/items/entities/listing.entity';
import { Tag } from 'src/items/entities/tag.entity';
import { DataSource } from 'typeorm';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.getOrThrow('DB_HOST'),
  port: configService.getOrThrow('DB_PORT'),
  username: configService.getOrThrow('DB_USERNAME'),
  password: configService.getOrThrow('DB_PASSWORD'),
  database: configService.getOrThrow('DB_NAME'),
  migrations: ['/migrations/**'],
  entities: [Item, Listing, Tag, Comment],
});
