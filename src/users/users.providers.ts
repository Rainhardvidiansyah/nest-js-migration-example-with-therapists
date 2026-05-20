/* eslint-disable prettier/prettier */

import { DataSource } from 'typeorm';
import { UsersEntity } from './users.entity';


export const usersProviders = [{
    provide: 'USERS_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UsersEntity),
    inject: ['DATA_SOURCE'],
  },
];
