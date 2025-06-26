import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  public async create(createTagDto: CreateTagDto) {
    const tag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(tag);
  }

  public async findMultipleTags(tagIds: number[]) {
    const tagsFound = this.tagRepository.find({ where: { id: In(tagIds) } });
    return tagsFound;
  }

  public async delete(id: number) {
    await this.tagRepository.delete(id);

    return {
      deleted: true,
      id,
    };
  }

  public async softDelete(id: number) {
    await this.tagRepository.softDelete(id);
    return {
      deleted: true,
      id,
    };
  }
}
