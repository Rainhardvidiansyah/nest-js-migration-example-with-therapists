import { DataSource, EntityTarget } from "typeorm";
import { TherapistEntity } from "./therapists.entity";


export function CreateRepositoryProviders<T>(repositoryName: string, entity: EntityTarget<TherapistEntity>){
      return {
          provide: "THERAPISTS_REPOSITORY",
          useFactory: (dataSource: DataSource) => dataSource.getRepository(entity.valueOf),
          inject: ["DATA_SOURCE"]
      }
    }