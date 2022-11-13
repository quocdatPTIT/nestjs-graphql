import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './../auth/auth.module';

import { ContactService } from './services/contact.service';
import { ContactEntity } from './entities/contact.entity';
import { ContactResolver } from './resolvers/contact.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity]), AuthModule],
  providers: [ContactService, ContactResolver],
})
export class ContactsModule {}
