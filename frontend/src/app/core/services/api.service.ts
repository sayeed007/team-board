import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
  Board,
  CreateBoardDto,
  Card,
  CreateCardDto,
  MoveCardDto,
  List,
  CreateListDto,
  Team,
  CreateTeamDto,
  DailyStatus,
  CreateDailyStatusDto,
  DailySummary,
  Comment,
} from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Auth
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, data);
  }

  register(data: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/register`, data);
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/auth/me`);
  }

  // Boards
  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(`${this.apiUrl}/boards`);
  }

  getBoard(id: string): Observable<Board> {
    return this.http.get<Board>(`${this.apiUrl}/boards/${id}`);
  }

  createBoard(data: CreateBoardDto): Observable<Board> {
    return this.http.post<Board>(`${this.apiUrl}/boards`, data);
  }

  updateBoard(id: string, data: Partial<Board>): Observable<Board> {
    return this.http.patch<Board>(`${this.apiUrl}/boards/${id}`, data);
  }

  deleteBoard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/boards/${id}`);
  }

  // Lists
  getLists(boardId: string): Observable<List[]> {
    return this.http.get<List[]>(`${this.apiUrl}/boards/${boardId}/lists`);
  }

  createList(boardId: string, data: CreateListDto): Observable<List> {
    return this.http.post<List>(`${this.apiUrl}/boards/${boardId}/lists`, data);
  }

  updateList(listId: string, data: Partial<List>): Observable<List> {
    return this.http.patch<List>(`${this.apiUrl}/boards/_/lists/${listId}`, data);
  }

  deleteList(listId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/boards/_/lists/${listId}`);
  }

  // Cards
  getCards(boardId: string): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}/boards/${boardId}/cards`);
  }

  getCard(id: string): Observable<Card> {
    return this.http.get<Card>(`${this.apiUrl}/cards/${id}`);
  }

  createCard(boardId: string, data: CreateCardDto): Observable<Card> {
    return this.http.post<Card>(`${this.apiUrl}/boards/${boardId}/cards`, data);
  }

  updateCard(id: string, data: Partial<Card>): Observable<Card> {
    return this.http.patch<Card>(`${this.apiUrl}/cards/${id}`, data);
  }

  moveCard(id: string, data: MoveCardDto): Observable<Card> {
    return this.http.patch<Card>(`${this.apiUrl}/cards/${id}/move`, data);
  }

  deleteCard(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cards/${id}`);
  }

  // Comments
  getComments(cardId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/cards/${cardId}/comments`);
  }

  createComment(cardId: string, message: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/cards/${cardId}/comments`, { message });
  }

  // Teams
  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/teams`);
  }

  getTeam(id: string): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/teams/${id}`);
  }

  createTeam(data: CreateTeamDto): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/teams`, data);
  }

  // Users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  // Daily Status
  createDailyStatus(data: CreateDailyStatusDto): Observable<DailyStatus> {
    return this.http.post<DailyStatus>(`${this.apiUrl}/daily-status`, data);
  }

  getMyDailyStatus(date?: string): Observable<DailyStatus> {
    let params = new HttpParams();
    if (date) params = params.set('date', date);
    return this.http.get<DailyStatus>(`${this.apiUrl}/daily-status/my`, { params });
  }

  // Reports
  getEmployeeDailySummary(userId: string, date?: string): Observable<DailySummary> {
    let params = new HttpParams();
    if (date) params = params.set('date', date);
    return this.http.get<DailySummary>(`${this.apiUrl}/reports/employee/${userId}/daily-summary`, {
      params,
    });
  }

  getTeamDailySummary(
    teamId: string,
    date?: string,
  ): Observable<{ team: Team; date: Date; members: DailySummary[] }> {
    let params = new HttpParams();
    if (date) params = params.set('date', date);
    return this.http.get<{ team: Team; date: Date; members: DailySummary[] }>(
      `${this.apiUrl}/reports/team/${teamId}/daily-summary`,
      { params },
    );
  }

  // Notifications
  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notifications`);
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/notifications/unread-count`);
  }

  markNotificationAsRead(id: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/notifications/${id}/read`, {});
  }
}
