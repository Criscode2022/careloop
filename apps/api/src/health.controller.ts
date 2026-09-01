import { Controller, Get } from '@nestjs/common';
@Controller('health')
export class HealthController {
  @Get() ok() { return { status: 'ok', service: 'careloop-api', time: new Date().toISOString(), database: process.env.DATABASE_URL ? 'neon-configured' : 'in-memory' }; }
}
