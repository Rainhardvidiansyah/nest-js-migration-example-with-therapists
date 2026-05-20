import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBillingTable1779246250907 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        console.log("Running migration: CreateBillingTable1779246250907");

        await queryRunner.query(`
            CREATE TABLE billing (
                id SERIAL PRIMARY KEY,
                therapist_id INTEGER NOT NULL,
                amount NUMERIC(10, 2) NOT NULL,
                billing_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (therapist_id) REFERENCES therapists(id) ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
