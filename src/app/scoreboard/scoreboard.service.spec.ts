import { TestBed, inject } from '@angular/core/testing';

import { ScoreboardService } from './scoreboard.service';

describe('ScoreboardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScoreboardService]
    });
  });

  it('should be created', inject([ScoreboardService], (service: ScoreboardService) => {
    expect(service).toBeTruthy();
  }));
});
