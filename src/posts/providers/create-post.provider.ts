import {
  BadRequestException,
  Body,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  public async create(
    @Body() createPostDto: CreatePostDto,
    user: ActiveUserData,
  ) {
    let author = undefined;
    let tags = undefined;

    try {
      // Find author from database based on authorId
      author = await this.usersService.findOneById(user.sub);
      // Find tags
      tags = await this.tagsService.findMultipleTags(createPostDto.tags);
    } catch (error) {
      throw new ConflictException(error);
    }

    if (createPostDto.tags.length !== tags.length) {
      throw new BadRequestException('Please check your tag Ids');
    }

    // Create post
    const post = this.postRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });

    try {
      // return the post
      return await this.postRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Ensure post slug is unique and not a duplicate',
      });
    }
  }
}
