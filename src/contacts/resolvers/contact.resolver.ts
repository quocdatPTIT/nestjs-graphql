import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import { Inject, UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import { PermissionGroupEnum } from '../../users/enums/permission-group.enum';
import { PermissionGuard } from '../../auth/guards/permission.guard';

import StringConstant from '../../common/constant/string.constant';
import { GqlAuthGuard } from '../../auth/guards/graphql.guard';
import { HasPermission } from '../../users/decorators/has-permission.decorator';

import { ContactEntity } from '../entities/contact.entity';
import { ContactService } from '../services/contact.service';
import { ContactInput } from '../input/contact.input';
import { ContactStatusInput } from '../input/contact-status.input';

@Resolver((of) => ContactEntity)
@HasPermission(PermissionGroupEnum.ALL_PERMISSION_CONTACT)
export class ContactResolver {
  constructor(
    private contactService: ContactService,
    @Inject(ConfigService)
    private config: ConfigService,
    @Inject(StringConstant.PUB_SUB)
    private pubSub: PubSub,
  ) {}

  @Query((returns) => [ContactEntity])
  @UseGuards(GqlAuthGuard)
  async getPublishContacts() {
    return await this.contactService.getPublishContacts();
  }

  // Get All Contacts
  @UseGuards(GqlAuthGuard, PermissionGuard)
  @HasPermission(PermissionGroupEnum.VIEW_CONTACT)
  @Query((returns) => [ContactEntity])
  async getAllContacts() {
    return await this.contactService.getAllContacts();
  }

  // Get Single Contacts
  @UseGuards(GqlAuthGuard, PermissionGuard)
  @HasPermission(PermissionGroupEnum.VIEW_CONTACT)
  @Query((returns) => ContactEntity)
  async getSingleContacts(@Args('contactId') contactId: string) {
    return await this.contactService.getSingleContact(contactId);
  }

  // Update Contact
  @UseGuards(GqlAuthGuard, PermissionGuard)
  @HasPermission(PermissionGroupEnum.UPDATE_CONTACT)
  @Mutation((returns) => ContactEntity)
  async updateContact(
    @Args('contactId') contactId: string,
    @Args('contactInput') contactInput: ContactInput,
  ) {
    return await this.contactService.updateContact(contactId, contactInput);
  }

  // Change Status Contact (Active or Inactive)
  @UseGuards(GqlAuthGuard, PermissionGuard)
  @HasPermission(PermissionGroupEnum.CHANGE_STATUS_CONTACT)
  @Mutation((returns) => ContactEntity)
  async changeStatusContact(
    @Args('contactStatusInput') contactStatusInput: ContactStatusInput,
  ) {
    return this.contactService.changeStatusContact(contactStatusInput);
  }

  // Delete Contact
  @UseGuards(GqlAuthGuard, PermissionGuard)
  @HasPermission(PermissionGroupEnum.DELETE_CONTACT)
  @Mutation((returns) => ContactEntity)
  async deleteContact(@Args('contactId') contactId: string) {
    return await this.contactService.deleteContact(contactId);
  }

  // Create Contact
  @UseGuards(GqlAuthGuard, PermissionGuard)
  @HasPermission(PermissionGroupEnum.CREATE_CONTACT)
  @Mutation((returns) => ContactEntity)
  async createContact(@Args('contactInput') contactInput: ContactInput) {
    const newContact = await this.contactService.createContact(contactInput);
    await this.pubSub.publish('Contact Added', { contactAdded: newContact });
    return newContact;
  }

  @Subscription((returns) => ContactEntity, {
    name: 'contactAdded',
  })
  notifyContactAdded() {
    return this.pubSub.asyncIterator('Contact Added');
  }
}
