import { MigrationInterface, QueryRunner } from "typeorm";

export class RefactorUserTable1780810594442 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        console.log("Altering user table, change ID ");

        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log("reverting user table alteration.");
        await queryRunner.query(`
            ALTER TABLE "users" 
            ALTER COLUMN "id" DROP DEFAULT
            `);
    }

}
