import { TestBed } from '@angular/core/testing';

import { Functions } from './functions.service';

describe('Functions', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Functions = TestBed.get(Functions);
    expect(service).toBeTruthy();
  });
});
