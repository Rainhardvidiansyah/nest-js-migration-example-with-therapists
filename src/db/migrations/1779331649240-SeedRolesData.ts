import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedRolesData1779331649240 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        console.log("Seeding roles data...");

        await queryRunner.query(`
            INSERT INTO roles (id, role_name) VALUES 
            (gen_random_uuid(), 'admin'),
            (gen_random_uuid(), 'customer'),
            (gen_random_uuid(), 'therapist'),
            (gen_random_uuid(), 'developer'),
            (gen_random_uuid(), 'superadmin'),
            (gen_random_uuid(), 'manager'),
            (gen_random_uuid(), 'support'),
            (gen_random_uuid(), 'analyst'),
            (gen_random_uuid(), 'auditor'),
            (gen_random_uuid(), 'operator');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log("Reverting roles data...");

        await queryRunner.query(`
            DELETE FROM roles WHERE role_name IN ('admin', 'customer', 'therapist', 'developer', 'superadmin', 'manager', 'support', 'analyst', 'auditor', 'operator');
        `);
    }

}
