import { Membership, User } from './store';
export function publicUser(u: User) {
  return { id: u.id, email: u.email, name: u.name, createdAt: u.createdAt };
}
export function assertMember(memberships: Membership[], userId: string, circleId: string) {
  const m = memberships.find((x) => x.userId === userId && x.circleId === circleId);
  if (!m) {
    const err = new Error('Not a member of this care circle');
    (err as Error & { status: number }).status = 403;
    throw err;
  }
  return m;
}
