import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Boards (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let userId: string;
  let organizationId: string;
  let teamId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

    prisma = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clean up database
    await prisma.card.deleteMany();
    await prisma.list.deleteMany();
    await prisma.board.deleteMany();
    await prisma.team.deleteMany();
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();

    // Create test user and organization
    const registerResponse = await request(app.getHttpServer()).post('/auth/register').send({
      email: 'board@example.com',
      password: 'password123',
      name: 'Board User',
      organizationName: 'Board Org',
    });

    userId = registerResponse.body.id;
    organizationId = registerResponse.body.organizationId;

    // Login to get token
    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send({
      email: 'board@example.com',
      password: 'password123',
    });

    accessToken = loginResponse.body.access_token;

    // Create a test team
    const team = await prisma.team.create({
      data: {
        name: 'Test Team',
        organizationId,
        leadId: userId,
      },
    });
    teamId = team.id;
  });

  describe('/boards (POST)', () => {
    it('should create a new board', () => {
      return request(app.getHttpServer())
        .post('/boards')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'New Board',
          description: 'Board Description',
          teamId,
          isPrivate: false,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name', 'New Board');
          expect(res.body).toHaveProperty('description', 'Board Description');
          expect(res.body).toHaveProperty('organizationId', organizationId);
          expect(res.body).toHaveProperty('teamId', teamId);
        });
    });

    it('should return 401 without authentication', () => {
      return request(app.getHttpServer())
        .post('/boards')
        .send({
          name: 'New Board',
          teamId,
        })
        .expect(401);
    });

    it('should return 400 if required fields are missing', () => {
      return request(app.getHttpServer())
        .post('/boards')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          // Missing name
          teamId,
        })
        .expect(400);
    });
  });

  describe('/boards (GET)', () => {
    beforeEach(async () => {
      // Create test boards
      await request(app.getHttpServer())
        .post('/boards')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Board 1', teamId });

      await request(app.getHttpServer())
        .post('/boards')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Board 2', teamId });
    });

    it('should return all boards for organization', () => {
      return request(app.getHttpServer())
        .get('/boards')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(2);
        });
    });

    it('should filter boards by teamId', () => {
      return request(app.getHttpServer())
        .get(`/boards?teamId=${teamId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((board) => {
            expect(board.teamId).toBe(teamId);
          });
        });
    });
  });

  describe('/boards/:id (GET)', () => {
    let boardId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/boards')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Test Board', teamId });

      boardId = response.body.id;

      // Add a list to the board
      await request(app.getHttpServer())
        .post('/lists')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'To Do', boardId });
    });

    it('should return board with lists and cards', () => {
      return request(app.getHttpServer())
        .get(`/boards/${boardId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', boardId);
          expect(res.body).toHaveProperty('name', 'Test Board');
          expect(res.body).toHaveProperty('lists');
          expect(Array.isArray(res.body.lists)).toBe(true);
          expect(res.body.lists.length).toBeGreaterThan(0);
        });
    });

    it('should return 404 for non-existent board', () => {
      return request(app.getHttpServer())
        .get('/boards/nonexistent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('/boards/:id (PATCH)', () => {
    let boardId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/boards')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Original Board', teamId });

      boardId = response.body.id;
    });

    it('should update board', () => {
      return request(app.getHttpServer())
        .patch(`/boards/${boardId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Updated Board',
          description: 'Updated Description',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('name', 'Updated Board');
          expect(res.body).toHaveProperty('description', 'Updated Description');
        });
    });
  });

  describe('/boards/:id (DELETE)', () => {
    let boardId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/boards')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Board to Delete', teamId });

      boardId = response.body.id;
    });

    it('should soft delete board', async () => {
      await request(app.getHttpServer())
        .delete(`/boards/${boardId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      // Verify board is soft deleted
      const board = await prisma.board.findUnique({
        where: { id: boardId },
      });

      expect(board.isDeleted).toBe(true);
    });
  });

  describe('Board with Cards workflow', () => {
    let boardId: string;
    let listId: string;

    beforeEach(async () => {
      // Create board
      const boardResponse = await request(app.getHttpServer())
        .post('/boards')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Workflow Board', teamId });

      boardId = boardResponse.body.id;

      // Create list
      const listResponse = await request(app.getHttpServer())
        .post('/lists')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'To Do', boardId });

      listId = listResponse.body.id;
    });

    it('should create card in list', () => {
      return request(app.getHttpServer())
        .post('/cards')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Test Card',
          description: 'Card Description',
          listId,
          priority: 'HIGH',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('title', 'Test Card');
          expect(res.body).toHaveProperty('listId', listId);
          expect(res.body).toHaveProperty('priority', 'HIGH');
        });
    });

    it('should move card between lists', async () => {
      // Create second list
      const list2Response = await request(app.getHttpServer())
        .post('/lists')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'In Progress', boardId });

      const list2Id = list2Response.body.id;

      // Create card in first list
      const cardResponse = await request(app.getHttpServer())
        .post('/cards')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          title: 'Moving Card',
          listId,
        });

      const cardId = cardResponse.body.id;

      // Move card to second list
      return request(app.getHttpServer())
        .patch(`/cards/${cardId}/move`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          listId: list2Id,
          position: 0,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('listId', list2Id);
          expect(res.body).toHaveProperty('position', 0);
        });
    });
  });
});
