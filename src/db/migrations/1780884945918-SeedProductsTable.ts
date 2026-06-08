import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedProductsTable1780884945918 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        console.log(`======Running products seeding...`);
        
        await queryRunner.query(
            `INSERT INTO public.products (name, sku, description, price, quantity, "isActive") VALUES
            ('Totebag Kanvas Hitam 12oz', 'TB-HITAM-12', 'Totebag bahan kanvas tebal 12oz warna hitam', 98000.00, 50, true),
            ('Totebag Kanvas Cream 14oz', 'TB-CREAM-14', 'Totebag premium warna cream dengan bahan 14oz', 125000.00, 30, true),
            ('Totebag Custom Sablon', 'TB-CUSTOM-01', 'Totebag custom sablon logo komunitas', 110000.00, 20, true),
            ('Totebag Polos Natural', 'TB-NATURAL-01', 'Totebag polos warna natural tanpa sablon', 85000.00, 100, true),
            ('Totebag Zipper Hitam', 'TB-ZIP-01', 'Totebag dengan resleting dan inner pocket', 135000.00, 25, true),                
            ('Totebag Waterproof', 'TB-WP-01', 'Totebag dengan lapisan dalam tahan air', 145000.00, 15, true),
            ('Totebag Mini Casual', 'TB-MINI-01', 'Totebag ukuran kecil untuk casual use', 75000.00, 40, true),
            ('Totebag Laptop 14 Inch', 'TB-LAP-14', 'Totebag khusus untuk laptop hingga 14 inch', 155000.00, 10, true),
            ('Totebag Kanvas Army', 'TB-ARMY-01', 'Totebag warna hijau army dengan bahan kuat', 99000.00, 35, true),
            ('Totebag Premium Leather Mix', 'TB-LEATHER-01', 'Totebag kombinasi kanvas dan aksen kulit sintetis', 175000.00, 8, true)
            ON CONFLICT ("sku") DO NOTHING;
            `
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM public.products WHERE sku IN (
            'TB-HITAM-12',
            'TB-CREAM-14',
            'TB-CUSTOM-01',
            'TB-NATURAL-01',
            'TB-ZIP-01',
            'TB-WP-01',
            'TB-MINI-01',
            'TB-LAP-14',
            'TB-ARMY-01',
            'TB-LEATHER-01'
        );`
    )
    }

}
