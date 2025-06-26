import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';

@Injectable()
export class PostsService {
  constructor(
    /*
     * Injecting Users Service
     */
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  public async create(@Body() createPostDto: CreatePostDto) {
    // Create post
    const post = this.postRepository.create(createPostDto);
    // return the post to the user
    return await this.postRepository.save(post);
  }

  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);

    return [
      {
        user: user,
        title: 'Test Tile',
        content: 'Test Content',
      },
      {
        user: user,
        title: 'Test Tile 2',
        content: 'Test Content 2',
      },
    ];
  }
}
