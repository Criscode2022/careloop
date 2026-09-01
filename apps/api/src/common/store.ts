import { randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';

export type Role = 'owner' | 'caregiver' | 'viewer';
export interface User { id: string; email: string; name: string; passwordHash: string; createdAt: string; }
export interface Circle { id: string; name: string; inviteCode: string; createdAt: string; }
export interface Membership { id: string; userId: string; circleId: string; role: Role; createdAt: string; }
export interface CareRecipient { id: string; circleId: string; name: string; dateOfBirth?: string; conditions: string; notes: string; createdAt: string; }
export interface Medication { id: string; recipientId: string; name: string; dosage: string; schedule: string; nextDueAt: string; active: boolean; }
export interface DoseLog { id: string; medicationId: string; takenAt: string; status: 'taken' | 'missed' | 'skipped'; note: string; }
export interface TaskItem { id: string; circleId: string; title: string; description: string; dueAt?: string; status: 'open' | 'done' | 'cancelled'; priority: 'low' | 'medium' | 'high'; assigneeId?: string; createdAt: string; }
export interface JournalNote { id: string; circleId: string; authorId: string; body: string; mood: 'steady' | 'low' | 'high' | 'anxious' | 'relieved'; createdAt: string; }

const id = () => randomBytes(8).toString('hex');
const now = () => new Date().toISOString();

export class MemoryStore {
  users: User[] = [];
  circles: Circle[] = [];
  memberships: Membership[] = [];
  recipients: CareRecipient[] = [];
  medications: Medication[] = [];
  doseLogs: DoseLog[] = [];
  tasks: TaskItem[] = [];
  notes: JournalNote[] = [];
  reset() {
    this.users = []; this.circles = []; this.memberships = []; this.recipients = [];
    this.medications = []; this.doseLogs = []; this.tasks = []; this.notes = [];
  }
  async seedDemo() {
    if (this.users.length) return;
    const passwordHash = await bcrypt.hash('CareLoop!2026', 10);
    const owner: User = { id: id(), email: 'maya@careloop.app', name: 'Maya Chen', passwordHash, createdAt: now() };
    const partner: User = { id: id(), email: 'jordan@careloop.app', name: 'Jordan Chen', passwordHash, createdAt: now() };
    this.users.push(owner, partner);
    const circle: Circle = { id: id(), name: 'Chen Household', inviteCode: 'CHEN-7K2Q', createdAt: now() };
    this.circles.push(circle);
    this.memberships.push(
      { id: id(), userId: owner.id, circleId: circle.id, role: 'owner', createdAt: now() },
      { id: id(), userId: partner.id, circleId: circle.id, role: 'caregiver', createdAt: now() },
    );
    const dad: CareRecipient = { id: id(), circleId: circle.id, name: 'Robert Chen', dateOfBirth: '1948-04-12', conditions: 'Type 2 diabetes, mild hypertension', notes: 'Prefers morning appointments.', createdAt: now() };
    this.recipients.push(dad);
    this.medications.push(
      { id: id(), recipientId: dad.id, name: 'Metformin', dosage: '500mg', schedule: 'twice daily with meals', nextDueAt: new Date(Date.now() + 3 * 3600_000).toISOString(), active: true },
      { id: id(), recipientId: dad.id, name: 'Lisinopril', dosage: '10mg', schedule: 'once daily morning', nextDueAt: new Date(Date.now() + 18 * 3600_000).toISOString(), active: true },
    );
    this.tasks.push({ id: id(), circleId: circle.id, title: 'Refill Metformin at CVS', description: 'Prior auth approved.', dueAt: new Date(Date.now() + 2 * 86400_000).toISOString(), status: 'open', priority: 'high', assigneeId: partner.id, createdAt: now() });
    this.notes.push({ id: id(), circleId: circle.id, authorId: owner.id, body: 'Energy good after walk. Blood sugar 118 before lunch.', mood: 'steady', createdAt: now() });
  }
}
export const store = new MemoryStore();
