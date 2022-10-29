import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ContactsModule } from './contacts/contacts.module';
import { getEnvPath } from './common/helpers/env.helper';
import { DatabaseModule } from './common/modules/database.module';
import { GlobalModule } from './common/modules/global.module';
import { GraphqlConfigModule } from './common/modules/graphql-config.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);

@Module({
  imports: [
    ContactsModule,
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
    }),
    DatabaseModule,
    GlobalModule,
    GraphqlConfigModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
