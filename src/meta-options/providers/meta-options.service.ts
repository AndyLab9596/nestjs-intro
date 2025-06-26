import { Injectable } from '@nestjs/common';
import { CreatePostMetaOptionsDto } from '../dtos/create-post-meta-options.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MetaOption } from '../meta-option.entity';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  public async createMetaOption(
    createPostMetaOptionDto: CreatePostMetaOptionsDto,
  ) {
    const metaOption = this.metaOptionRepository.create(
      createPostMetaOptionDto,
    );
    return await this.metaOptionRepository.save(metaOption);
  }
}
