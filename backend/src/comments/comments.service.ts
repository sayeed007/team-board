import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(cardId: string, createCommentDto: CreateCommentDto, userId: string) {
    // Verify card exists
    const card = await this.prisma.card.findFirst({
      where: { id: cardId, deletedAt: null },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const comment = await this.prisma.comment.create({
      data: {
        cardId,
        userId,
        message: createCommentDto.message,
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
    });

    // Create activity log
    await this.prisma.activityLog.create({
      data: {
        cardId,
        userId,
        actionType: 'COMMENT_ADDED',
        metadata: { commentId: comment.id },
      },
    });

    return comment;
  }

  async findAll(cardId: string) {
    return this.prisma.comment.findMany({
      where: { cardId },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Only allow deleting own comments
    if (comment.userId !== userId) {
      throw new NotFoundException('You can only delete your own comments');
    }

    await this.prisma.comment.delete({ where: { id } });

    return { message: 'Comment deleted successfully' };
  }
}
