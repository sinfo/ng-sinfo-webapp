import { TestBed } from '@angular/core/testing';

import { LivestreamService } from './livestream.service';

describe('LivestreamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LivestreamService = TestBed.get(LivestreamService);
    expect(service).toBeTruthy();
  });
});
