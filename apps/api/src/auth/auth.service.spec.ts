import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { store } from '../common/store';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(() => {
    store.reset();
    service = new AuthService(new JwtService({ secret: 'test-secret-careloop-32characters!' }));
  });
  it('registers and returns a token', async () => {
    const res = await service.register('a@b.com', 'password12', 'Ada');
    expect(res.token).toBeTruthy();
    expect(res.user.email).toBe('a@b.com');
  });
  it('rejects duplicate emails', async () => {
    await service.register('a@b.com', 'password12', 'Ada');
    await expect(service.register('a@b.com', 'password12', 'Ada')).rejects.toThrow();
  });
  it('logs in with valid credentials', async () => {
    await service.register('a@b.com', 'password12', 'Ada');
    const res = await service.login('a@b.com', 'password12');
    expect(res.user.name).toBe('Ada');
  });
  it('rejects bad passwords', async () => {
    await service.register('a@b.com', 'password12', 'Ada');
    await expect(service.login('a@b.com', 'nope')).rejects.toThrow();
  });
});
