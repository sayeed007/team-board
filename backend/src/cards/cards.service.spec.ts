import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { CardsService } from './cards.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { MoveCardDto } from './dto/move-card.dto';

describe('CardsService', () => {
  let service: CardsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    card: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    list: {
      findUnique: jest.fn(),
    },
    board: {
      findUnique: jest.fn(),
    },
    activityLog: {
      create: jest.fn(),
    },
  };

  const mockUser = {
    id: 'user-1',
    organizationId: 'org-1',
    role: 'EMPLOYEE',
  };

  const mockCard = {
    id: 'card-1',
    title: 'Test Card',
    description: 'Test Description',
    listId: 'list-1',
    position: 0,
    status: 'TODO',
    priority: 'MEDIUM',
    assigneeId: 'user-1',
    dueDate: null,
    estimatedHours: null,
    actualHours: null,
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
  };

  const mockList = {
    id: 'list-1',
    name: 'To Do',
    boardId: 'board-1',
    position: 0,
    board: {
      id: 'board-1',
      organizationId: 'org-1',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardsService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<CardsService>(CardsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a card', async () => {
      const createCardDto: CreateCardDto = {
        title: 'New Card',
        description: 'New Description',
        listId: 'list-1',
        priority: 'HIGH',
        assigneeId: 'user-1',
      };

      mockPrismaService.list.findUnique.mockResolvedValue(mockList);
      mockPrismaService.card.create.mockResolvedValue({
        ...mockCard,
        ...createCardDto,
      });

      const result = await service.create('board-1', createCardDto, mockUser.id);

      expect(result.title).toBe(createCardDto.title);
      expect(mockPrismaService.card.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          title: createCardDto.title,
          listId: createCardDto.listId,
          priority: createCardDto.priority,
        }),
        include: expect.any(Object),
      });
    });

    it('should throw ForbiddenException if list belongs to different organization', async () => {
      const createCardDto: CreateCardDto = {
        title: 'New Card',
        listId: 'list-1',
      };

      const differentOrgList = {
        ...mockList,
        board: { ...mockList.board, organizationId: 'org-2' },
      };

      mockPrismaService.list.findUnique.mockResolvedValue(differentOrgList);

      await expect(service.create('board-1', createCardDto, mockUser.id)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all cards for a list', async () => {
      const cards = [mockCard, { ...mockCard, id: 'card-2' }];
      mockPrismaService.card.findMany.mockResolvedValue(cards);

      const result = await service.findAll('board-1');

      expect(result).toHaveLength(2);
      expect(mockPrismaService.card.findMany).toHaveBeenCalledWith({
        where: { boardId: 'board-1', deletedAt: null },
        include: expect.any(Object),
        orderBy: { position: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a card by id', async () => {
      mockPrismaService.card.findUnique.mockResolvedValue(mockCard);

      const result = await service.findOne('card-1');

      expect(result).toEqual(mockCard);
    });

    it('should throw NotFoundException if card does not exist', async () => {
      mockPrismaService.card.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should successfully update a card', async () => {
      const updateCardDto: UpdateCardDto = {
        title: 'Updated Card',
        priority: 'HIGH',
      };

      mockPrismaService.card.findUnique.mockResolvedValue({
        ...mockCard,
        list: mockList,
      });
      mockPrismaService.card.update.mockResolvedValue({
        ...mockCard,
        ...updateCardDto,
      });

      const result = await service.update('card-1', updateCardDto, mockUser.id);

      expect(result.title).toBe(updateCardDto.title);
    });
  });

  describe('move', () => {
    it('should successfully move a card to a different list', async () => {
      const moveCardDto: MoveCardDto = {
        listId: 'list-2',
        position: 1,
      };

      const targetList = {
        id: 'list-2',
        boardId: 'board-1',
        board: {
          id: 'board-1',
          organizationId: 'org-1',
        },
      };

      mockPrismaService.card.findUnique.mockResolvedValue({
        ...mockCard,
        list: mockList,
      });
      mockPrismaService.list.findUnique.mockResolvedValue(targetList);
      mockPrismaService.card.update.mockResolvedValue({
        ...mockCard,
        listId: moveCardDto.listId,
        position: moveCardDto.position,
      });

      const result = await service.move('card-1', moveCardDto, mockUser.id);

      expect(result.listId).toBe(moveCardDto.listId);
      expect(result.position).toBe(moveCardDto.position);

      // Should create activity log for card movement
      expect(mockPrismaService.activityLog.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          cardId: 'card-1',
          userId: mockUser.id,
          actionType: 'CARD_MOVED',
        }),
      });
    });

    it('should update position without creating activity log when moving within same list', async () => {
      const moveCardDto: MoveCardDto = {
        listId: 'list-1', // Same list
        position: 2,
      };

      mockPrismaService.card.findUnique.mockResolvedValue({
        ...mockCard,
        list: mockList,
      });
      mockPrismaService.list.findUnique.mockResolvedValue(mockList);
      mockPrismaService.card.update.mockResolvedValue({
        ...mockCard,
        position: moveCardDto.position,
      });

      await service.move('card-1', moveCardDto, mockUser.id);

      // Should NOT create activity log for position change within same list
      expect(mockPrismaService.activityLog.create).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if target list belongs to different organization', async () => {
      const moveCardDto: MoveCardDto = {
        listId: 'list-2',
        position: 1,
      };

      const differentOrgList = {
        id: 'list-2',
        boardId: 'board-2',
        board: {
          id: 'board-2',
          organizationId: 'org-2', // Different org
        },
      };

      mockPrismaService.card.findUnique.mockResolvedValue({
        ...mockCard,
        list: mockList,
      });
      mockPrismaService.list.findUnique.mockResolvedValue(differentOrgList);

      await expect(service.move('card-1', moveCardDto, mockUser.id)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a card', async () => {
      mockPrismaService.card.findUnique.mockResolvedValue({
        ...mockCard,
        list: mockList,
      });
      mockPrismaService.card.update.mockResolvedValue({
        ...mockCard,
        isDeleted: true,
      });

      await service.remove('card-1', mockUser.id);

      expect(mockPrismaService.card.update).toHaveBeenCalledWith({
        where: { id: 'card-1' },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw ForbiddenException if card belongs to different organization', async () => {
      const differentOrgList = {
        ...mockList,
        board: { ...mockList.board, organizationId: 'org-2' },
      };

      mockPrismaService.card.findUnique.mockResolvedValue({
        ...mockCard,
        list: differentOrgList,
      });

      await expect(service.remove('card-1', mockUser.id)).rejects.toThrow(ForbiddenException);
    });
  });
});
