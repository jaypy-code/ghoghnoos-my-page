import { TestBed } from '@angular/core/testing';

import { Socket } from './socket.service';

describe('SocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Socket = TestBed.get(Socket);
    expect(service).toBeTruthy();
  });
});
