import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListsService {
  constructor(private prisma: PrismaService) {}

  async create(boardId: string, createListDto: CreateListDto) {
    // Get max position for this board
    const maxPosition = await this.prisma.list.aggregate({
      where: { boardId },
      _max: { position: true },
    });

    const position = createListDto.position ?? (maxPosition._max.position ?? -1) + 1;

    return this.prisma.list.create({
      data: {
        ...createListDto,
        boardId,
        position,
      },
      include: {
        _count: { select: { cards: true } },
      },
    });
  }

  async findAll(boardId: string) {
    return this.prisma.list.findMany({
      where: { boardId },
      include: {
        cards: {
          where: { deletedAt: null },
          orderBy: { position: 'asc' },
        },
        _count: { select: { cards: true } },
      },
      orderBy: { position: 'asc' },
    });
  }

  async update(id: string, updateListDto: UpdateListDto) {
    const list = await this.prisma.list.findUnique({ where: { id } });
    if (!list) {
      throw new NotFoundException('List not found');
    }

    return this.prisma.list.update({
      where: { id },
      data: updateListDto,
    });
  }

  async remove(id: string) {
    const list = await this.prisma.list.findUnique({ where: { id } });
    if (!list) {
      throw new NotFoundException('List not found');
    }

    // Move all cards to first list in board or delete them
    await this.prisma.card.deleteMany({ where: { listId: id } });

    await this.prisma.list.delete({ where: { id } });

    return { message: 'List deleted successfully' };
  }
}
