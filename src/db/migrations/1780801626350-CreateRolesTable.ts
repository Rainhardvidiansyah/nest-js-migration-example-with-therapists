import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRolesTable1780801626350 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log("Running migration: CreateRolesTable");

        await queryRunner.query(`
            CREATE TABLE "roles" (
                "id" UUID NOT NULL,
                "role_name" VARCHAR(255) NOT NULL,
                "description" TEXT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "deleted_at" TIMESTAMP NULL,
                CONSTRAINT "PK_roles_id" PRIMARY KEY ("id")
            )
        `);

        // Membuat index unik untuk role_name berdasarkan dekorator @Index({ unique: true })
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_ROLES_ROLE_NAME" ON "roles" ("role_name")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log("Reverting migration: CreateRolesTable");

        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ROLES_ROLE_NAME"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "roles"`);
    }

}
