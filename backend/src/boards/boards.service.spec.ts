import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

describe('BoardsService', () => {
  let service: BoardsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    board: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
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

  const mockBoard = {
    id: 'board-1',
    name: 'Test Board',
    description: 'Test Description',
    organizationId: 'org-1',
    teamId: 'team-1',
    isPrivate: false,
    settings: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    isDeleted: false,
    lists: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoardsService, { provide: PrismaService, useValue: mockPrismaService }],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a board', async () => {
      const createBoardDto: CreateBoardDto = {
        name: 'New Board',
        description: 'New Description',
        teamId: 'team-1',
      };

      mockPrismaService.board.create.mockResolvedValue({
        ...mockBoard,
        ...createBoardDto,
      });

      const result = await service.create(createBoardDto, mockUser.organizationId, mockUser.id);

      expect(result.name).toBe(createBoardDto.name);
      expect(mockPrismaService.board.create).toHaveBeenCalledWith({
        data: {
          ...createBoardDto,
          organizationId: mockUser.organizationId,
        },
        include: { lists: true },
      });
    });
  });

  describe('findAll', () => {
    it('should return all boards for organization', async () => {
      const boards = [mockBoard, { ...mockBoard, id: 'board-2' }];
      mockPrismaService.board.findMany.mockResolvedValue(boards);

      const result = await service.findAll(mockUser.organizationId, mockUser.id);

      expect(result).toHaveLength(2);
      expect(mockPrismaService.board.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: mockUser.organizationId,
          isDeleted: false,
        },
        include: { lists: true },
      });
    });

    it('should filter by teamId when provided', async () => {
      const teamId = 'team-1';
      mockPrismaService.board.findMany.mockResolvedValue([mockBoard]);

      await service.findAll(mockUser.organizationId, teamId);

      expect(mockPrismaService.board.findMany).toHaveBeenCalledWith({
        where: {
          organizationId: mockUser.organizationId,
          teamId,
          isDeleted: false,
        },
        include: { lists: true },
      });
    });
  });

  describe('findOne', () => {
    it('should return a board by id', async () => {
      mockPrismaService.board.findFirst.mockResolvedValue(mockBoard);

      const result = await service.findOne('board-1', mockUser.organizationId);

      expect(result).toEqual(mockBoard);
      expect(mockPrismaService.board.findFirst).toHaveBeenCalledWith({
        where: { id: 'board-1', isDeleted: false },
        include: {
          lists: {
            where: { isDeleted: false },
            include: {
              cards: {
                where: { isDeleted: false },
                include: {
                  assignee: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      avatar: true,
                    },
                  },
                  labels: true,
                },
                orderBy: { position: 'asc' },
              },
            },
            orderBy: { position: 'asc' },
          },
        },
      });
    });

    it('should throw NotFoundException if board does not exist', async () => {
      mockPrismaService.board.findFirst.mockResolvedValue(null);

      await expect(service.findOne('nonexistent', mockUser.organizationId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should successfully update a board', async () => {
      const updateBoardDto: UpdateBoardDto = {
        name: 'Updated Board',
        description: 'Updated Description',
      };

      mockPrismaService.board.findUnique.mockResolvedValue(mockBoard);
      mockPrismaService.board.update.mockResolvedValue({
        ...mockBoard,
        ...updateBoardDto,
      });

      const result = await service.update('board-1', updateBoardDto, mockUser.organizationId);

      expect(result.name).toBe(updateBoardDto.name);
      expect(mockPrismaService.board.update).toHaveBeenCalledWith({
        where: { id: 'board-1' },
        data: updateBoardDto,
        include: { lists: true },
      });
    });

    it('should throw ForbiddenException if board belongs to different organization', async () => {
      const updateBoardDto: UpdateBoardDto = { name: 'Updated' };
      const differentOrgBoard = { ...mockBoard, organizationId: 'org-2' };

      mockPrismaService.board.findUnique.mockResolvedValue(differentOrgBoard);

      await expect(
        service.update('board-1', updateBoardDto, mockUser.organizationId),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should soft delete a board', async () => {
      mockPrismaService.board.findUnique.mockResolvedValue(mockBoard);
      mockPrismaService.board.update.mockResolvedValue({
        ...mockBoard,
        isDeleted: true,
      });

      await service.remove('board-1', mockUser.organizationId);

      expect(mockPrismaService.board.update).toHaveBeenCalledWith({
        where: { id: 'board-1' },
        data: { isDeleted: true },
      });
    });

    it('should throw ForbiddenException if board belongs to different organization', async () => {
      const differentOrgBoard = { ...mockBoard, organizationId: 'org-2' };
      mockPrismaService.board.findUnique.mockResolvedValue(differentOrgBoard);

      await expect(service.remove('board-1', mockUser.organizationId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
