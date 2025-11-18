import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async create(createBoardDto: CreateBoardDto, organizationId: string, userId: string) {
    const board = await this.prisma.board.create({
      data: {
        ...createBoardDto,
        organizationId,
        createdBy: userId,
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        team: true,
        _count: { select: { lists: true, cards: true } },
      },
    });

    // Add creator as board owner
    await this.prisma.boardMember.create({
      data: {
        boardId: board.id,
        userId,
        role: 'OWNER',
      },
    });

    return board;
  }

  async findAll(organizationId: string, userId: string) {
    // Get boards where user is a member or creator
    const boards = await this.prisma.board.findMany({
      where: {
        organizationId,
        isArchived: false,
        OR: [
          { createdBy: userId },
          {
            boardMembers: {
              some: { userId },
            },
          },
        ],
      },
      include: {
        creator: { select: { id: true, name: true } },
        team: { select: { id: true, name: true } },
        _count: { select: { lists: true, cards: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return boards;
  }

  async findOne(id: string, organizationId: string) {
    const board = await this.prisma.board.findFirst({
      where: { id, organizationId },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        team: true,
        boardMembers: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true, role: true },
            },
          },
        },
        lists: {
          orderBy: { position: 'asc' },
          include: {
            cards: {
              where: { deletedAt: null },
              orderBy: { position: 'asc' },
              include: {
                assignee: {
                  select: { id: true, name: true, email: true, avatarUrl: true },
                },
              },
            },
          },
        },
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return board;
  }

  async update(id: string, updateBoardDto: UpdateBoardDto, organizationId: string) {
    await this.findOne(id, organizationId);

    return this.prisma.board.update({
      where: { id },
      data: updateBoardDto,
    });
  }

  async remove(id: string, organizationId: string) {
    await this.findOne(id, organizationId);

    await this.prisma.board.delete({ where: { id } });

    return { message: 'Board deleted successfully' };
  }
}
