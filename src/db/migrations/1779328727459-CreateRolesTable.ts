import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRolesTable1779328727459 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("Running migration: CreateRolesTable1779328727459");
         await queryRunner.query(`
            CREATE TABLE roles (
                id UUID PRIMARY KEY,
                role_name VARCHAR(255) NOT NULL UNIQUE,
                description TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT now(),
                updated_at TIMESTAMP NOT NULL DEFAULT now(),
                deleted_at TIMESTAMP NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS roles;
        `);
    }

}
