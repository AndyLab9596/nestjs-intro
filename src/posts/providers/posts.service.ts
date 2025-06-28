import {
  BadRequestException,
  Body,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Tag } from 'src/tags/tag.entity';
import { GetPostsDto } from '../dtos/get-post.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { CreatePostProvider } from './create-post.provider';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Injectable()
export class PostsService {
  constructor(
    /*
     * Injecting Users Service
     */
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    private readonly paginationProvider: PaginationProvider,
    private readonly createPostProvider: CreatePostProvider,

    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    @InjectRepository(MetaOption)
    private readonly metaOptionRepository: Repository<MetaOption>,
  ) {}

  public async create(
    @Body() createPostDto: CreatePostDto,
    user: ActiveUserData,
  ) {
    await this.createPostProvider.create(createPostDto, user);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async findAll(
    _userId: string,
    postQuery: GetPostsDto,
  ): Promise<Paginated<Post>> {
    const posts = await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postRepository,
    );
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

  public async update(patchPostDto: PatchPostDto) {
    let tagToBeUpdated: Tag[] = [];
    try {
      tagToBeUpdated = await this.tagsService.findMultipleTags(
        patchPostDto.tags,
      );
    } catch (error) {
      throw new RequestTimeoutException(error?.message);
    }

    if (!tagToBeUpdated || tagToBeUpdated.length !== patchPostDto.tags.length) {
      throw new BadRequestException(
        'please check you tag Ids and ensure they are correct',
      );
    }

    let foundPost: Post;
    try {
      foundPost = await this.postRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException(error?.message);
    }

    if (foundPost) {
      throw new BadRequestException('The post ID does not exist');
    }

    // const metaOptionToBeUpdated = await this.metaOptionRepository.findOneBy({
    //   id: patchPostDto.metaOptionId,
    // });

    foundPost.tags = tagToBeUpdated;
    foundPost.title = patchPostDto.title ?? foundPost.title;
    foundPost.content = patchPostDto.content ?? foundPost.content;
    foundPost.status = patchPostDto.status ?? foundPost.status;
    foundPost.postType = patchPostDto.postType ?? foundPost.postType;
    foundPost.slug = patchPostDto.slug ?? foundPost.slug;
    foundPost.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? foundPost.featuredImageUrl;
    foundPost.publishOn = patchPostDto.publishOn ?? foundPost.publishOn;

    // Object.assign(foundPost, {
    //   ...patchPostDto,
    //   tags: tagToBeUpdated,
    //   // metaOption: metaOptionToBeUpdated,
    // });

    try {
      const postUpdated = this.postRepository.save(foundPost);
      return postUpdated;
    } catch (error) {
      throw new RequestTimeoutException(error.message);
    }
  }
}
