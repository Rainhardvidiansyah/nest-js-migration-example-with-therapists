
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

            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        
           
            synchronize: false,
            logging: false,
            extra: {
                max: 20,
                min: 2,
                idleTimeoutMillis: 30000,
                connectionTimeoutMillis: 2000,
            }
        });

        console.log("Data Source has been initialized!");
        return dataSource.initialize();
    }
}]

  // export function CreateRepositoryProviders<T>(repositoryName: string, entity: EntityTarget<T>){
  //     return {
  //         provide: repositoryName,
  //         useFactory: (dataSource: DataSource) => dataSource.getRepository(entity.valueOf),
  //         inject: ["DATA_SOURCE"]
  //     }
    //}