import { MedicationsService } from './medications.service';
import { CirclesService } from '../circles/circles.service';
import { store } from '../common/store';

describe('MedicationsService', () => {
  const meds = new MedicationsService();
  const circles = new CirclesService();
  let userId: string; let circleId: string; let recipientId: string;
  beforeEach(() => {
    store.reset();
    userId = 'user-1';
    store.users.push({ id: userId, email: 't@t.com', name: 'Tester', passwordHash: 'x', createdAt: new Date().toISOString() });
    const circle = circles.create(userId, 'Home');
    circleId = circle.id;
    recipientId = circles.addRecipient(userId, circleId, { name: 'Dad' }).id;
  });
  it('creates a medication and logs a taken dose', () => {
    const med = meds.create(userId, { recipientId, name: 'Metformin', dosage: '500mg', schedule: 'bid', nextDueAt: new Date().toISOString() });
    const result = meds.logDose(userId, med.id, 'taken');
    expect(result.log.status).toBe('taken');
    expect(meds.list(userId, circleId)).toHaveLength(1);
  });
  it('blocks outsiders', () => {
    expect(() => meds.list('stranger', circleId)).toThrow();
  });
});
