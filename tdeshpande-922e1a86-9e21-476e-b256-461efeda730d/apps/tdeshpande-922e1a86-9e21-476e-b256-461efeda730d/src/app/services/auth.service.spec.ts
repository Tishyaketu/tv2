import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully and store token', () => {
    const mockResponse = {
      access_token: 'test-token',
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'Owner',
        organizationId: 'org-1'
      }
    };

    service.login({ email: 'test@example.com', password: 'password' }).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('access_token')).toBe('test-token');
    });

    const req = httpMock.expectOne('http://localhost:3000/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should return token from localStorage', () => {
    localStorage.setItem('access_token', 'stored-token');
    expect(service.getToken()).toBe('stored-token');
  });

  it('should return true if authenticated', () => {
    localStorage.setItem('access_token', 'test-token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should return false if not authenticated', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should logout and clear storage', () => {
    localStorage.setItem('access_token', 'test-token');
    localStorage.setItem('current_user', JSON.stringify({ id: '1' }));

    service.logout();

    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('current_user')).toBeNull();
  });
});
