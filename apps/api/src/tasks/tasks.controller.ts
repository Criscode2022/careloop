import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { TasksService } from './tasks.service';
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasks: TasksService) {}
  @Get() list(@Req() req: { user: { userId: string } }, @Query('circleId') circleId: string) { return this.tasks.list(req.user.userId, circleId); }
  @Post() create(@Req() req: { user: { userId: string } }, @Body() body: { circleId: string; title: string; description?: string; dueAt?: string; priority?: 'low' | 'medium' | 'high'; assigneeId?: string }) { return this.tasks.create(req.user.userId, body); }
  @Patch(':id') update(@Req() req: { user: { userId: string } }, @Param('id') id: string, @Body() body: { status: 'open' | 'done' | 'cancelled' }) { return this.tasks.updateStatus(req.user.userId, id, body.status); }
}
