import { DataSource } from "typeorm";
import { RolesEntity } from "./roles.entity";


export const rolesProviders = [
  {
    provide: 'ROLES_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(RolesEntity),
    inject: ['DATA_SOURCE'],
  },
];