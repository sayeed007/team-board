import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { LoginRequest, Board, Card, MoveCardDto } from '../../shared/models';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Authentication', () => {
    it('should login user', () => {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        access_token: 'mock-token',
        user: {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'EMPLOYEE' as const,
          organizationId: 'org-1',
        },
      };

      service.login(loginData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginData);
      req.flush(mockResponse);
    });

    it('should register user', () => {
      const registerData = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
        organizationName: 'New Org',
      };

      const mockResponse = {
        id: 'user-1',
        email: 'new@example.com',
        name: 'New User',
        role: 'ORG_ADMIN' as const,
        organizationId: 'org-1',
      };

      service.register(registerData).subscribe((response) => {
        expect(response.email).toBe(registerData.email);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should get user profile', () => {
      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'EMPLOYEE' as const,
        status: 'ACTIVE' as const,
        organizationId: 'org-1',
      };

      service.getProfile().subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/profile`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('Boards', () => {
    it('should get all boards', () => {
      const mockBoards: Board[] = [
        {
          id: 'board-1',
          name: 'Board 1',
          description: 'Description 1',
          organizationId: 'org-1',
          teamId: 'team-1',
          isPrivate: false,
          settings: {},
          lists: [],
        },
        {
          id: 'board-2',
          name: 'Board 2',
          description: 'Description 2',
          organizationId: 'org-1',
          teamId: 'team-1',
          isPrivate: false,
          settings: {},
          lists: [],
        },
      ];

      service.getBoards().subscribe((boards) => {
        expect(boards.length).toBe(2);
        expect(boards).toEqual(mockBoards);
      });

      const req = httpMock.expectOne(`${apiUrl}/boards`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBoards);
    });

    it('should get board by id', () => {
      const mockBoard: Board = {
        id: 'board-1',
        name: 'Test Board',
        description: 'Test Description',
        organizationId: 'org-1',
        teamId: 'team-1',
        isPrivate: false,
        settings: {},
        lists: [],
      };

      service.getBoard('board-1').subscribe((board) => {
        expect(board).toEqual(mockBoard);
      });

      const req = httpMock.expectOne(`${apiUrl}/boards/board-1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBoard);
    });

    it('should create board', () => {
      const createData = {
        name: 'New Board',
        description: 'New Description',
        teamId: 'team-1',
        isPrivate: false,
      };

      const mockBoard: Board = {
        id: 'board-1',
        ...createData,
        organizationId: 'org-1',
        settings: {},
        lists: [],
      };

      service.createBoard(createData).subscribe((board) => {
        expect(board.name).toBe(createData.name);
      });

      const req = httpMock.expectOne(`${apiUrl}/boards`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createData);
      req.flush(mockBoard);
    });

    it('should update board', () => {
      const updateData = { name: 'Updated Board' };

      service.updateBoard('board-1', updateData).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/boards/board-1`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(updateData);
      req.flush({});
    });

    it('should delete board', () => {
      service.deleteBoard('board-1').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/boards/board-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('Cards', () => {
    it('should create card', () => {
      const createData = {
        title: 'New Card',
        description: 'Card Description',
        listId: 'list-1',
        priority: 'HIGH' as const,
      };

      service.createCard(createData).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/cards`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createData);
      req.flush({});
    });

    it('should update card', () => {
      const updateData = { title: 'Updated Card' };

      service.updateCard('card-1', updateData).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/cards/card-1`);
      expect(req.request.method).toBe('PATCH');
      req.flush({});
    });

    it('should move card', () => {
      const moveData: MoveCardDto = {
        listId: 'list-2',
        position: 1,
      };

      service.moveCard('card-1', moveData).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/cards/card-1/move`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(moveData);
      req.flush({});
    });

    it('should delete card', () => {
      service.deleteCard('card-1').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/cards/card-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});
