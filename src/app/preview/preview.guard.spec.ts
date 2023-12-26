import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { previewGuard } from './preview.guard';

describe('previewGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => previewGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
