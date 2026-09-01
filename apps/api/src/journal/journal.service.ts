import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { JournalNote, store } from '../common/store';
import { assertMember, publicUser } from '../common/public';
@Injectable()
export class JournalService {
  list(userId: string, circleId: string) {
    assertMember(store.memberships, userId, circleId);
    return store.notes.filter((n) => n.circleId === circleId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((n) => ({ ...n, author: publicUser(store.users.find((u) => u.id === n.authorId)!) }));
  }
  create(userId: string, circleId: string, body: string, mood: JournalNote['mood']) {
    assertMember(store.memberships, userId, circleId);
    const note: JournalNote = { id: randomBytes(8).toString('hex'), circleId, authorId: userId, body, mood, createdAt: new Date().toISOString() };
    store.notes.push(note);
    return note;
  }
}
