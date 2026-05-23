import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedUsersTable1779334441797 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        console.log('Seeding users table with initial data...');

        await queryRunner.query(`
            INSERT INTO "public"."users" ("email", "password", "isActive") VALUES

            ('john.doe@example.com', '$2a$10$QZ304y3ZBrTGWthA9Y7fU.ZZd6maT7fx5R69y5oR/t9edIWVxsOwa', true),
            ('jane.smith@example.com', '$2a$10$R3tTZuPii5oHxDCtwDv...v1H7t4YtR7Ce1Ya/L9KYBPHDJUt0YOu', true),
            ('ali@email.com', '$2a$10$8xdGnamWOJIBbCsQgojFouvSED9H8XU9lv8fg6eaZlIZbEWOaf.Xi', false),
            ('mohammed@example.com', '$2a$10$IZujPwhj0xRqvCeRj0fMNOSnJOdC9FkW/N/lnIQgSNkfPWFdKJZby', true);
            
            `)

    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            DELETE FROM "users" 
            WHERE "email" IN (
                'john.doe@example.com', 
                'jane.smith@example.com', 
                'ali@email.com', 
                'mohammed@example.com'
            )`
        )
    }

}
