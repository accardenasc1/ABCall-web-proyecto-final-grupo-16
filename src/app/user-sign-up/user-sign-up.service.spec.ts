import { TestBed } from '@angular/core/testing';

import { UserSignUpService } from './user-sign-up.service';

describe('UserSignUpService', () => {
  let service: UserSignUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSignUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
