import { Module } from '@nestjs/common';
import { TherapistsService } from './therapists.service';
import { TherapistsController } from './therapists.controller';

@Module({
  providers: [TherapistsService],
  controllers: [TherapistsController]
})
export class TherapistsModule {}
