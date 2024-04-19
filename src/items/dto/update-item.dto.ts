import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  name: string;
  public: boolean;
  comments: CreateCommentDto[];
}
