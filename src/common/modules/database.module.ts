import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ContactEntity } from '../../contacts/entities/contact.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { PermissionEntity } from '../../users/entities/permission.entity';
import { RoleEntity } from '../../users/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [ContactEntity, UserEntity, PermissionEntity, RoleEntity],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
