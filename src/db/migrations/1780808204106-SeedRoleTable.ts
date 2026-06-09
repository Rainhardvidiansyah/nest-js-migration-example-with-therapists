import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedRoleTable1780808204106 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        console.log("Seeding roles table...");
        
        await queryRunner.query(`
            INSERT INTO roles (id, role_name) VALUES 
            (gen_random_uuid(), 'admin'),
            (gen_random_uuid(), 'customer'),
            (gen_random_uuid(), 'therapist'),
            (gen_random_uuid(), 'developer'),
            (gen_random_uuid(), 'super_admin'),
            (gen_random_uuid(), 'manager'),
            (gen_random_uuid(), 'support'),
            (gen_random_uuid(), 'analyst'),
            (gen_random_uuid(), 'auditor'),
            (gen_random_uuid(), 'operator');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        console.log("reverting seed for roles table...");

        await queryRunner.query(`
            DELETE FROM roles WHERE role_name IN(
            'admin', 
            'customer', 
            'therapist', 
            'developer', 
            'super_admin', 
            'manager', 
            'support', 
            'analyst', 
            'auditor', 
            'operator'
    `);
}

}
