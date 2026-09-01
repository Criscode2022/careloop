import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CirclesService } from './circles.service';
@Controller('circles')
@UseGuards(JwtAuthGuard)
export class CirclesController {
  constructor(private readonly circles: CirclesService) {}
  @Get() list(@Req() req: { user: { userId: string } }) { return this.circles.list(req.user.userId); }
  @Post() create(@Req() req: { user: { userId: string } }, @Body() body: { name: string }) { return this.circles.create(req.user.userId, body.name); }
  @Post('join') join(@Req() req: { user: { userId: string } }, @Body() body: { inviteCode: string }) { return this.circles.join(req.user.userId, body.inviteCode); }
  @Get(':id/dashboard') dashboard(@Req() req: { user: { userId: string } }, @Param('id') id: string) { return this.circles.dashboard(req.user.userId, id); }
  @Post(':id/recipients') addRecipient(@Req() req: { user: { userId: string } }, @Param('id') id: string, @Body() body: { name: string; dateOfBirth?: string; conditions?: string; notes?: string }) { return this.circles.addRecipient(req.user.userId, id, body); }
}
