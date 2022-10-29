import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

import StringConstant from '../../common/constant/string.constant';

import { ContactEntity } from '../entities/contact.entity';
import { ContactService } from '../services/contact.service';
import { ContactInput } from '../input/contact.input';
import { ContactStatusInput } from '../input/contact-status.input';

@Resolver((of) => ContactEntity)
export class ContactResolver {
  constructor(
    private contactService: ContactService,
    @Inject(ConfigService)
    private config: ConfigService,
    @Inject(StringConstant.PUB_SUB)
    private pubSub: PubSub,
  ) {}

  @Query((returns) => [ContactEntity])
  async getPublishContacts() {
    return await this.contactService.getPublishContacts();
  }

  // Get All Contacts
  @Query((returns) => [ContactEntity])
  async getAllContacts() {
    return await this.contactService.getAllContacts();
  }

  // Get Single Contacts
  @Query((returns) => ContactEntity)
  async getSingleContacts(@Args('contactId') contactId: string) {
    return await this.contactService.getSingleContact(contactId);
  }

  // Update Contact
  @Mutation((returns) => ContactEntity)
  async updateContact(
    @Args('contactId') contactId: string,
    @Args('contactInput') contactInput: ContactInput,
  ) {
    return await this.contactService.updateContact(contactId, contactInput);
  }

  // Change Status Contact (Active or Inactive)
  @Mutation((returns) => ContactEntity)
  async changeStatusContact(
    @Args('contactStatusInput') contactStatusInput: ContactStatusInput,
  ) {
    return this.contactService.changeStatusContact(contactStatusInput);
  }

  // Delete Contact
  @Mutation((returns) => ContactEntity)
  async deleteContact(@Args('contactId') contactId: string) {
    return await this.contactService.deleteContact(contactId);
  }

  // Create Contact
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
