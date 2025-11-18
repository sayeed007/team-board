import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { MoveCardDto } from './dto/move-card.dto';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async create(boardId: string, createCardDto: CreateCardDto, userId: string) {
    // Get max position for this list
    const maxPosition = await this.prisma.card.aggregate({
      where: { listId: createCardDto.listId, deletedAt: null },
      _max: { position: true },
    });

    const position = (maxPosition._max.position ?? -1) + 1;

    const card = await this.prisma.card.create({
      data: {
        ...createCardDto,
        boardId,
        position,
        createdBy: userId,
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        creator: {
          select: { id: true, name: true },
        },
        list: {
          select: { id: true, name: true },
        },
      },
    });

    // Create activity log
    await this.prisma.activityLog.create({
      data: {
        cardId: card.id,
        userId,
        actionType: 'CARD_CREATED',
        metadata: { title: card.title },
      },
    });

    return card;
  }

  async findAll(boardId: string) {
    return this.prisma.card.findMany({
      where: {
        boardId,
        deletedAt: null,
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        list: {
          select: { id: true, name: true },
        },
      },
      orderBy: [{ listId: 'asc' }, { position: 'asc' }],
    });
  }

  async findOne(id: string) {
    const card = await this.prisma.card.findFirst({
      where: { id, deletedAt: null },
      include: {
        assignee: {
          select: { id: true, name: true, email: true, avatarUrl: true, role: true },
        },
        creator: {
          select: { id: true, name: true, email: true },
        },
        list: {
          select: { id: true, name: true },
        },
        board: {
          select: { id: true, name: true },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, avatarUrl: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        activityLogs: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
      },
    });

    if (!card) {
      throw new NotFoundException('Card not found');
    }

    return card;
  }

  async update(id: string, updateCardDto: UpdateCardDto, userId: string) {
    const card = await this.findOne(id);

    const updated = await this.prisma.card.update({
      where: { id },
      data: updateCardDto,
      include: {
        assignee: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
      },
    });

    // Log status changes
    if (updateCardDto.status && updateCardDto.status !== card.status) {
      await this.prisma.activityLog.create({
        data: {
          cardId: id,
          userId,
          actionType: 'STATUS_CHANGED',
          metadata: {
            from: card.status,
            to: updateCardDto.status,
          },
        },
      });
    }

    // Log priority changes
    if (updateCardDto.priority && updateCardDto.priority !== card.priority) {
      await this.prisma.activityLog.create({
        data: {
          cardId: id,
          userId,
          actionType: 'PRIORITY_CHANGED',
          metadata: {
            from: card.priority,
            to: updateCardDto.priority,
          },
        },
      });
    }

    // Log assignment changes
    if (updateCardDto.assigneeId && updateCardDto.assigneeId !== card.assigneeId) {
      await this.prisma.activityLog.create({
        data: {
          cardId: id,
          userId,
          actionType: 'CARD_ASSIGNED',
          metadata: {
            assigneeId: updateCardDto.assigneeId,
          },
        },
      });
    }

    return updated;
  }

  async move(id: string, moveCardDto: MoveCardDto, userId: string) {
    const card = await this.findOne(id);

    const updated = await this.prisma.card.update({
      where: { id },
      data: {
        listId: moveCardDto.listId,
        position: moveCardDto.position ?? 0,
      },
    });

    // Create activity log for card movement
    if (card.listId !== moveCardDto.listId) {
      await this.prisma.activityLog.create({
        data: {
          cardId: id,
          userId,
          actionType: 'CARD_MOVED',
          metadata: {
            fromListId: card.listId,
            toListId: moveCardDto.listId,
          },
        },
      });
    }

    return updated;
  }

  async remove(id: string, userId: string) {
    const card = await this.findOne(id);

    // Soft delete
    await this.prisma.card.update({
      where: { id: card.id },
      data: { deletedAt: new Date() },
    });

    // Log deletion
    await this.prisma.activityLog.create({
      data: {
        cardId: id,
        userId,
        actionType: 'CARD_DELETED',
        metadata: { title: card.title },
      },
    });

    return { message: 'Card deleted successfully' };
  }
}
