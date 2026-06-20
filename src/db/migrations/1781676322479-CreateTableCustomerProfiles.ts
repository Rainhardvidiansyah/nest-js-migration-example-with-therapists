import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableCustomerProfiles1781676322479 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        console.log('Running Customer Profiles Migration...')

        await queryRunner.query(`
            CREATE TABLE customer_profiles (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL UNIQUE,
            phone VARCHAR(20),
            address TEXT,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now(),
            CONSTRAINT fk_customer_user
                FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE)
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE IF EXISTS customer_profiles`
        );
    }

}
