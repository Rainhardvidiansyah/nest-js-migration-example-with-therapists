import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTherapistTable1779152222261 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("Running migration: CreateTherapistTable1779152222261");
        await queryRunner.query(


        `CREATE TABLE therapists (
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
        
    )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
