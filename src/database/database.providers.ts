/* eslint-disable prettier/prettier */
import { ConfigService } from "@nestjs/config";
import { DataSource } from "typeorm";



export const DatabaseProviders = [{
    provide: "DATA_SOURCE",
    inject: [ConfigService],
    useFactory: async(configService: ConfigService) => {
        const dataSource = new DataSource({
            type: "postgres",
            host: configService.get<string>("DATABASE_HOST"),
            port: configService.get<number>("DATABASE_PORT"),
            username: configService.get<string>("DATABASE_USER"),
            password: configService.get<string>("DATABASE_PASSWORD"),
            database: configService.get<string>("DATABASE_NAME"),
            entities: ["src/**/*.entity.ts"],
            migrations: ["src/db/migrations/*.ts"],
            synchronize: false,
            logging: true,
        });

        
        console.log("database connected");
        
        return dataSource;
    }
}]

  // export function CreateRepositoryProviders<T>(repositoryName: string, entity: EntityTarget<T>){
  //     return {
  //         provide: repositoryName,
  //         useFactory: (dataSource: DataSource) => dataSource.getRepository(entity.valueOf),
  //         inject: ["DATA_SOURCE"]
  //     }
    //}