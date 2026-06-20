import { DataSource } from "typeorm";
import { CustomerProfilesEntity } from "./customers.entity";


export const customerProviders = [
  {
    provide: 'CUSTOMER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(CustomerProfilesEntity),
    inject: ['DATA_SOURCE'],
  },
];