import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersRoleTable1780801641474 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("Running migration: CreateUsersRoleTable");

        
        await queryRunner.query(`
            CREATE TABLE "users_roles" (
                "user_id" UUID NOT NULL,
                "role_id" UUID NOT NULL,
                CONSTRAINT "PK_users_roles" PRIMARY KEY ("user_id", "role_id")
            )
        `);

        
        await queryRunner.query(`
            ALTER TABLE "users_roles" 
            ADD CONSTRAINT "FK_USERS_ROLES_USER" 
            FOREIGN KEY ("user_id") REFERENCES "users" ("id") 
            ON DELETE CASCADE ON UPDATE CASCADE
        `);

        // 3. Menambahkan Foreign Key ke tabel roles
        await queryRunner.query(`
            ALTER TABLE "users_roles" 
            ADD CONSTRAINT "FK_USERS_ROLES_ROLE" 
            FOREIGN KEY ("role_id") REFERENCES "roles" ("id") 
            ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log("Reverting migration: CreateUsersRoleTable");

        
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT IF EXISTS "FK_USERS_ROLES_ROLE"`);
        await queryRunner.query(`ALTER TABLE "users_roles" DROP CONSTRAINT IF EXISTS "FK_USERS_ROLES_USER"`);
        
        
        await queryRunner.query(`DROP TABLE IF EXISTS "users_roles"`);
    }

}
