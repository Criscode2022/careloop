import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { store, User } from '../common/store';
import { publicUser } from '../common/public';

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}
  async register(email: string, password: string, name: string) {
    const existing = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) throw new ConflictException('Email already registered');
    if (!password || password.length < 8) throw new UnauthorizedException('Password must be at least 8 characters');
    const user: User = { id: randomBytes(8).toString('hex'), email: email.toLowerCase(), name, passwordHash: await bcrypt.hash(password, 10), createdAt: new Date().toISOString() };
    store.users.push(user);
    return this.issue(user);
  }
  async login(email: string, password: string) {
    const user = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    return this.issue(user);
  }
  async me(userId: string) {
    const user = store.users.find((u) => u.id === userId);
    if (!user) throw new UnauthorizedException();
    const circles = store.memberships.filter((m) => m.userId === userId).map((m) => ({ ...m, circle: store.circles.find((c) => c.id === m.circleId) }));
    return { user: publicUser(user), circles };
  }
  private issue(user: User) {
    return { token: this.jwt.sign({ sub: user.id, email: user.email }), user: publicUser(user) };
  }
}
