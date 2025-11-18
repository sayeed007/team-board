import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { ApiService } from '../../core/services/api.service';
import { Board } from '../../shared/models';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
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
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['getBoards']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
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

    fixture = TestBed.createComponent(DashboardComponent);
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
  });

  it('should calculate correct statistics', () => {
    apiService.getBoards.and.returnValue(of(mockBoards));

    component.ngOnInit();

    expect(component.stats.totalBoards).toBe(2);
    expect(component.stats.totalLists).toBe(0);
    expect(component.stats.totalCards).toBe(0);
  });

  it('should navigate to boards list', () => {
    component.navigateToBoards();

    expect(router.navigate).toHaveBeenCalledWith(['/boards']);
  });

  it('should navigate to specific board', () => {
    component.navigateToBoard('board-1');

    expect(router.navigate).toHaveBeenCalledWith(['/boards', 'board-1']);
  });

  it('should handle empty boards list', () => {
    apiService.getBoards.and.returnValue(of([]));

    component.ngOnInit();

    expect(component.boards.length).toBe(0);
    expect(component.stats.totalBoards).toBe(0);
  });
});
