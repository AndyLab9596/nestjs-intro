import { Body, Controller, Post } from '@nestjs/common';
import { MetaOptionsService } from './providers/meta-options.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-options.dto';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly metaOptionService: MetaOptionsService) {}

  @Post('')
  @ApiOperation({
    summary: 'Create a meta option',
  })
  @ApiResponse({
    status: 201,
    description:
      'You get a 201 response if your meta option is created successfully',
  })
  public createMetaOption(
    @Body() createPostMetaOptionDto: CreatePostMetaOptionsDto,
  ) {
    return this.metaOptionService.createMetaOption(createPostMetaOptionDto);
  }
}
