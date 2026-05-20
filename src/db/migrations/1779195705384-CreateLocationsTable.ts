import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLocationsTable1779195705384 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("Running migration: CreateLocationsTable1779195705384");
         await queryRunner.query(`
            CREATE TABLE locations (
                id UUID PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
