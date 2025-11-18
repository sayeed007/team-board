import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('comments')
@ApiBearerAuth()
@Controller('cards/:cardId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a comment to a card' })
  create(
    @Param('cardId') cardId: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.commentsService.create(cardId, createCommentDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments for a card' })
  findAll(@Param('cardId') cardId: string) {
    return this.commentsService.findAll(cardId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  remove(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.commentsService.remove(id, userId);
  }
}
