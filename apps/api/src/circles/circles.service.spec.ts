import { CirclesService } from './circles.service';
import { store } from '../common/store';

describe('CirclesService', () => {
  const svc = new CirclesService();
  beforeEach(() => {
    store.reset();
    store.users.push(
      { id: 'u1', email: 'a@a.com', name: 'A', passwordHash: 'x', createdAt: new Date().toISOString() },
      { id: 'u2', email: 'b@b.com', name: 'B', passwordHash: 'x', createdAt: new Date().toISOString() },
    );
  });
  it('creates a circle and joins via invite', () => {
    const circle = svc.create('u1', 'Family');
    expect(svc.join('u2', circle.inviteCode).id).toBe(circle.id);
    svc.addRecipient('u1', circle.id, { name: 'Mom' });
    expect(svc.dashboard('u1', circle.id).stats.recipients).toBe(1);
  });
});
