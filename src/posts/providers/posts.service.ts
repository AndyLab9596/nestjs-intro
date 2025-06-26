import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    /*
     * Injecting Users Service
     */
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  public async create(@Body() createPostDto: CreatePostDto) {
    // Create post
    const post = this.postRepository.create(createPostDto);
    // return the post to the user
    return await this.postRepository.save(post);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async findAll(_userId: string) {
    const posts = await this.postRepository.find();
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
