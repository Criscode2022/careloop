import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { JournalService } from './journal.service';
@Controller('journal')
@UseGuards(JwtAuthGuard)
export class JournalController {
  constructor(private readonly journal: JournalService) {}
  @Get() list(@Req() req: { user: { userId: string } }, @Query('circleId') circleId: string) { return this.journal.list(req.user.userId, circleId); }
  @Post() create(@Req() req: { user: { userId: string } }, @Body() body: { circleId: string; body: string; mood: 'steady' | 'low' | 'high' | 'anxious' | 'relieved' }) { return this.journal.create(req.user.userId, body.circleId, body.body, body.mood); }
}
