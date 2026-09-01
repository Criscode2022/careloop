import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CirclesModule } from './circles/circles.module';
import { MedicationsModule } from './medications/medications.module';
import { TasksModule } from './tasks/tasks.module';
import { JournalModule } from './journal/journal.module';
import { HealthController } from './health.controller';
@Module({ imports: [AuthModule, CirclesModule, MedicationsModule, TasksModule, JournalModule], controllers: [HealthController] })
export class AppModule {}
