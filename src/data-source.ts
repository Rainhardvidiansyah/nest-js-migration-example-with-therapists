import "reflect-metadata";
import { DataSource } from "typeorm";

import * as dotenv from "dotenv";
import * as path from "path";


dotenv.config({ 
  path: path.join(__dirname, 
    process.env.NODE_ENV === 'development' ? '../.env.development' : '../.env'
  ) 
});

const migrationsPath = process.env.NODE_ENV === 'development'
  ? "src/db/migrations/**/*{.ts,.js}"
  : "dist/db/migrations/**/*.js";

export const AppDataSource = new DataSource({
    type: "postgres",
    
    host: process.env.DATABASE_HOST || "127.0.0.1",
    port: parseInt(process.env.DATABASE_PORT || "5432", 10),
    username: process.env.DATABASE_USER || "user",
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME || "oauth_playground_nest",

    synchronize: false,
    logging: true,
    ssl: false,
    connectTimeoutMS: 5000, // 5 seconds timeout for connection attempts. IMPORTANT: Adjust this value based on your environment and needs.
    extra: {
        connectionTimeoutMillis: 5000,
        query_timeout: 5000
    },
    // entities: ["src/**/*.entity.ts"], //Comment this! or else, it will be searching the entities. It has nothing to do with the entities, cause this file is CLI (migration and run migration) config. 
    
    migrations: [migrationsPath],
    
    migrationsTableName: "migrations",
});

//npx ts-node -P ./tsconfig.json -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./src/data-source.ts
//npx typeorm migration:create src/db/migrations/post-refactoring
