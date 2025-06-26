import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';

@Injectable()
export class PostsService {
  constructor(
    /*
     * Injecting Users Service
     */
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  public async create(@Body() createPostDto: CreatePostDto) {
    // Find author from database based on authorId
    const author = await this.usersService.findOneById(createPostDto.authorId);
    const tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    // Create post
    const post = this.postRepository.create({ ...createPostDto, author, tags });
    // return the post to the user
    return await this.postRepository.save(post);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async findAll(_userId: string) {
    const posts = await this.postRepository.find({
      relations: {
        metaOption: true,
        author: true,
        tags: true,
      },
    });
    return posts;
  }

  public async delete(id: number) {
    // Find the post
    const foundPost = await this.postRepository.findOneBy({ id });

    if (foundPost) {
      await this.postRepository.delete({ id });
    }

    return { deleted: true, id };
  }
}
