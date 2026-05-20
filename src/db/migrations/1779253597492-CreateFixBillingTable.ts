import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFixBillingTable1779253597492 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        console.log("Running migration: CreateFixBillingTable1779253597492");
         await queryRunner.query(`
            CREATE TABLE billings (
                id UUID PRIMARY KEY,
                amount NUMERIC(12,2) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
