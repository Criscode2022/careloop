import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { DoseLog, Medication, store } from '../common/store';
import { assertMember } from '../common/public';
@Injectable()
export class MedicationsService {
  private circleOfMed(med: Medication) {
    const rec = store.recipients.find((r) => r.id === med.recipientId);
    if (!rec) throw new NotFoundException('Recipient not found');
    return rec.circleId;
  }
  list(userId: string, circleId: string) {
    assertMember(store.memberships, userId, circleId);
    const recipients = store.recipients.filter((r) => r.circleId === circleId);
    return store.medications.filter((m) => recipients.some((r) => r.id === m.recipientId)).map((m) => ({ ...m, recipient: recipients.find((r) => r.id === m.recipientId), logs: store.doseLogs.filter((l) => l.medicationId === m.id).slice(-10) }));
  }
  create(userId: string, data: { recipientId: string; name: string; dosage: string; schedule: string; nextDueAt: string }) {
    const rec = store.recipients.find((r) => r.id === data.recipientId);
    if (!rec) throw new NotFoundException('Recipient not found');
    assertMember(store.memberships, userId, rec.circleId);
    const med: Medication = { id: randomBytes(8).toString('hex'), recipientId: data.recipientId, name: data.name, dosage: data.dosage, schedule: data.schedule, nextDueAt: data.nextDueAt, active: true };
    store.medications.push(med);
    return med;
  }
  logDose(userId: string, medicationId: string, status: DoseLog['status'], note = '') {
    const med = store.medications.find((m) => m.id === medicationId);
    if (!med) throw new NotFoundException('Medication not found');
    assertMember(store.memberships, userId, this.circleOfMed(med));
    const log: DoseLog = { id: randomBytes(8).toString('hex'), medicationId, takenAt: new Date().toISOString(), status, note };
    store.doseLogs.push(log);
    if (status === 'taken') { const next = new Date(); next.setHours(next.getHours() + 12); med.nextDueAt = next.toISOString(); }
    return { log, medication: med };
  }
}
