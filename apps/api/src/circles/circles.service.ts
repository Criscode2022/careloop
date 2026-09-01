import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { store, Circle, CareRecipient } from '../common/store';
import { assertMember, publicUser } from '../common/public';
@Injectable()
export class CirclesService {
  list(userId: string) {
    return store.memberships.filter((m) => m.userId === userId).map((m) => ({
      membership: m,
      circle: store.circles.find((c) => c.id === m.circleId),
      members: store.memberships.filter((x) => x.circleId === m.circleId).map((x) => ({ ...x, user: publicUser(store.users.find((u) => u.id === x.userId)!) })),
      recipients: store.recipients.filter((r) => r.circleId === m.circleId),
    }));
  }
  create(userId: string, name: string) {
    const circle: Circle = { id: randomBytes(8).toString('hex'), name, inviteCode: randomBytes(3).toString('hex').toUpperCase(), createdAt: new Date().toISOString() };
    store.circles.push(circle);
    store.memberships.push({ id: randomBytes(8).toString('hex'), userId, circleId: circle.id, role: 'owner', createdAt: new Date().toISOString() });
    return circle;
  }
  join(userId: string, inviteCode: string) {
    const circle = store.circles.find((c) => c.inviteCode.toLowerCase() === inviteCode.toLowerCase());
    if (!circle) throw new NotFoundException('Invite code not found');
    if (!store.memberships.find((m) => m.userId === userId && m.circleId === circle.id)) {
      store.memberships.push({ id: randomBytes(8).toString('hex'), userId, circleId: circle.id, role: 'caregiver', createdAt: new Date().toISOString() });
    }
    return circle;
  }
  addRecipient(userId: string, circleId: string, data: Partial<CareRecipient> & { name: string }) {
    assertMember(store.memberships, userId, circleId);
    const recipient: CareRecipient = { id: randomBytes(8).toString('hex'), circleId, name: data.name, dateOfBirth: data.dateOfBirth, conditions: data.conditions || '', notes: data.notes || '', createdAt: new Date().toISOString() };
    store.recipients.push(recipient);
    return recipient;
  }
  dashboard(userId: string, circleId: string) {
    assertMember(store.memberships, userId, circleId);
    const recipients = store.recipients.filter((r) => r.circleId === circleId);
    const meds = store.medications.filter((m) => recipients.some((r) => r.id === m.recipientId && m.active));
    const tasks = store.tasks.filter((t) => t.circleId === circleId && t.status === 'open');
    const notes = store.notes.filter((n) => n.circleId === circleId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);
    const overdueMeds = meds.filter((m) => new Date(m.nextDueAt).getTime() < Date.now());
    return { circle: store.circles.find((c) => c.id === circleId), recipients, medications: meds, overdueMeds, openTasks: tasks, recentNotes: notes.map((n) => ({ ...n, author: publicUser(store.users.find((u) => u.id === n.authorId)!) })), stats: { recipients: recipients.length, activeMeds: meds.length, openTasks: tasks.length, overdueMeds: overdueMeds.length } };
  }
}
