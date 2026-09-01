import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { store, TaskItem } from '../common/store';
import { assertMember, publicUser } from '../common/public';
@Injectable()
export class TasksService {
  list(userId: string, circleId: string) {
    assertMember(store.memberships, userId, circleId);
    return store.tasks.filter((t) => t.circleId === circleId).map((t) => ({ ...t, assignee: t.assigneeId ? publicUser(store.users.find((u) => u.id === t.assigneeId)!) : null })).sort((a, b) => Number(a.status === 'done') - Number(b.status === 'done'));
  }
  create(userId: string, data: Partial<TaskItem> & { circleId: string; title: string }) {
    assertMember(store.memberships, userId, data.circleId);
    const task: TaskItem = { id: randomBytes(8).toString('hex'), circleId: data.circleId, title: data.title, description: data.description || '', dueAt: data.dueAt, status: 'open', priority: data.priority || 'medium', assigneeId: data.assigneeId, createdAt: new Date().toISOString() };
    store.tasks.push(task);
    return task;
  }
  updateStatus(userId: string, taskId: string, status: TaskItem['status']) {
    const task = store.tasks.find((t) => t.id === taskId);
    if (!task) throw new NotFoundException('Task not found');
    assertMember(store.memberships, userId, task.circleId);
    task.status = status;
    return task;
  }
}
