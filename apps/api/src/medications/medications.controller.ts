import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { MedicationsService } from './medications.service';
@Controller('medications')
@UseGuards(JwtAuthGuard)
export class MedicationsController {
  constructor(private readonly meds: MedicationsService) {}
  @Get() list(@Req() req: { user: { userId: string } }, @Query('circleId') circleId: string) { return this.meds.list(req.user.userId, circleId); }
  @Post() create(@Req() req: { user: { userId: string } }, @Body() body: { recipientId: string; name: string; dosage: string; schedule: string; nextDueAt: string }) { return this.meds.create(req.user.userId, body); }
  @Post(':id/log') log(@Req() req: { user: { userId: string } }, @Param('id') id: string, @Body() body: { status: 'taken' | 'missed' | 'skipped'; note?: string }) { return this.meds.logDose(req.user.userId, id, body.status, body.note); }
}
