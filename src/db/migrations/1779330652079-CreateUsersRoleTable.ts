import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersRoleTable1779330652079 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        console.log("Running migration: CreateUsersRoleTable1779330652079");
        await queryRunner.query(`

            CREATE TABLE users_roles (
                user_id UUID NOT NULL,
                role_id UUID NOT NULL,
                PRIMARY KEY (user_id, role_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,

                CONSTRAINT "FK_user_roles_user" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    
                CONSTRAINT "FK_user_roles_role" FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
            )
            `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log("Reverting migration: CreateUsersRoleTable1779330652079");
        await queryRunner.query(`
            DROP TABLE IF EXISTS users_roles;
        `);
    }

}
