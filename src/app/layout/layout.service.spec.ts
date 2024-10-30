/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';

import { LayoutService } from './layout.service';
import { User } from '../models/user';
import { Role } from '../models/role';
describe('IncidentService', () => {
  let service: LayoutService;

  const mockUser: User = {
    id: 1,
    first_name: "Pablo",
    last_name: "Perez",
    username: "Pablito",
    type: Role.Admin
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ });
    service = TestBed.inject(LayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get user', () => {
    sessionStorage.setItem('user', JSON.stringify(mockUser))
    const user = service.getUser()
    expect(user).toEqual(mockUser);
  });

  it('should get undefine user', () => {
    sessionStorage.clear();
    const user = service.getUser()
    expect(user).toBeUndefined();
  });
});
