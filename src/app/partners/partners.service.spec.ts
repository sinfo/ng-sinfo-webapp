import { TestBed } from '@angular/core/testing';

import { PartnersService } from './partners.service';

describe('PartnersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PartnersService = TestBed.get(PartnersService);
    expect(service).toBeTruthy();
  });
});
