import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GraphQLError } from 'graphql/error';

import { ContactEntity } from '../entities/contact.entity';
import { ContactInput } from '../input/contact.input';
import { ContactStatusInput } from '../input/contact-status.input';
import { StatusEnum } from '../enums/status.enum';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity)
    private contactRepository: Repository<ContactEntity>,
  ) {}

  async getPublishContacts() {
    return await this.contactRepository.find({
      where: {
        isDeleted: false,
        isPublic: true,
      },
    });
  }

  async getSingleContact(contactId: string) {
    return await this.getContactById(contactId);
  }

  async getAllContacts() {
    return await this.contactRepository.find();
  }

  async updateContact(
    contactId: string,
    { phoneNumber, lastName, firstName }: ContactInput,
  ) {
    const dbContact = await this.getContactById(contactId);

    dbContact.phoneNumber = phoneNumber;
    dbContact.firstName = firstName;
    dbContact.lastName = lastName;

    return await this.contactRepository.save(dbContact);
  }

  async deleteContact(contactId: string) {
    const dbContact = await this.getContactById(contactId);

    dbContact.isDeleted = true;

    return await this.contactRepository.save(dbContact);
  }

  async changeStatusContact(input: ContactStatusInput) {
    const { contactId, status } = input;
    const dbContact = await this.getContactById(contactId);

    switch (status) {
      case StatusEnum.ACTIVE:
        dbContact.isPublic = true;
        break;
      case StatusEnum.INACTIVE:
        dbContact.isPublic = false;
        break;
    }

    return await this.contactRepository.save(dbContact);
  }

  async createContact({ phoneNumber, firstName, lastName }: ContactInput) {
    const exist = await this.contactRepository.findOne({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (exist) {
      throw new GraphQLError('Contact already exists');
    }

    const newContact = new ContactEntity();

    newContact.phoneNumber = phoneNumber;
    newContact.firstName = firstName;
    newContact.lastName = lastName;

    return await this.contactRepository.save(newContact);
  }

  private async getContactById(id: string) {
    const dbContact = await this.contactRepository.findOneBy({
      id: id,
      isDeleted: false,
    });

    if (!dbContact) {
      throw new GraphQLError('Contact not found');
    }

    return dbContact;
  }
}
