import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProductsTable1780884828517 implements MigrationInterface {

   public async up(queryRunner: QueryRunner): Promise<void>{
    
        console.log("Running migration: CreateProductsTable");    
        await queryRunner.query(`
            CREATE TABLE "products" (
                "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
                "name" VARCHAR(255) NOT NULL,
                "sku" VARCHAR(255) NULL,
                "description" TEXT NULL DEFAULT NULL,
                "price" NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
                "quantity" INT NOT NULL DEFAULT 0,
                "isActive" BOOLEAN NOT NULL DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_products_id" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_PRODUCTS_NAME" ON "products" ("name")
        `);

        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_PRODUCTS_SKU" ON "products" ("sku")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        console.log("Reverting migration: CreateProductsTable");

        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_PRODUCTS_SKU"`);

        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_PRODUCTS_NAME"`);
        
        await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
    }

}
