/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { DatabaseProviders } from './database.providers';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],

  providers: [
    ...DatabaseProviders,
  ],

  exports: [
    ...DatabaseProviders,
  ],
  
})
export class DatabaseModule {}
