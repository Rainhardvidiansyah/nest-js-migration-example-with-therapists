/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseProviders } from './database.providers';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],

  providers: [
    DatabaseService,
    ...DatabaseProviders,
    
  ],

  exports: [
    DatabaseService,
    ...DatabaseProviders,
  ],
  
})
export class DatabaseModule {}
