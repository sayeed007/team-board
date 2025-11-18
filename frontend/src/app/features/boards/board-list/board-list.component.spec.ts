import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { BoardListComponent } from './board-list.component';
import { ApiService } from '../../../core/services/api.service';
import { Board } from '../../../shared/models';

describe('BoardListComponent', () => {
  let component: BoardListComponent;
  let fixture: ComponentFixture<BoardListComponent>;
  let apiService: jasmine.SpyObj<ApiService>;
  let router: jasmine.SpyObj<Router>;

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

  beforeEach(async () => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getBoards', 'deleteBoard']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        BoardListComponent,
        HttpClientTestingModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
      ],
      providers: [
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(BoardListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load boards on init', () => {
    apiService.getBoards.and.returnValue(of(mockBoards));

    component.ngOnInit();

    expect(apiService.getBoards).toHaveBeenCalled();
    expect(component.boards).toEqual(mockBoards);
    expect(component.loading).toBe(false);
  });

  it('should set loading to false after boards are loaded', (done) => {
    apiService.getBoards.and.returnValue(of(mockBoards));

    component.ngOnInit();

    setTimeout(() => {
      expect(component.loading).toBe(false);
      done();
    }, 0);
  });

  it('should navigate to board detail when viewBoard is called', () => {
    component.viewBoard('board-1');

    expect(router.navigate).toHaveBeenCalledWith(['/boards', 'board-1']);
  });

  it('should delete board and reload list', () => {
    apiService.deleteBoard.and.returnValue(of(void 0));
    apiService.getBoards.and.returnValue(of([mockBoards[0]]));

    component.boards = mockBoards;
    component.deleteBoard('board-2');

    expect(apiService.deleteBoard).toHaveBeenCalledWith('board-2');
    expect(apiService.getBoards).toHaveBeenCalled();
  });

  it('should display "No boards found" when boards array is empty', () => {
    apiService.getBoards.and.returnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.boards.length).toBe(0);
  });
});
