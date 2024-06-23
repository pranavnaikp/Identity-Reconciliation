import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { Contact } from '../entity/contact';
import { isValidEmail } from '../utils/isvalid-email';

export const identifyContact = (contactRepository: Repository<Contact>) => async (req: Request, res: Response) => {
  const { email, phoneNumber } = req.body;

  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "At least one of email or phoneNumber is required" });
  }

  if (email && !isValidEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    // Fetch contacts with matching email or phone number
    const contacts = await contactRepository.find({
      where: [
        { email },
        { phoneNumber }
      ]
    });

    let primaryContact = contacts.find(contact => contact.linkPrecedence === 'primary') || contacts[0];

    if (!primaryContact) {
      primaryContact = new Contact();
      primaryContact.email = email;
      primaryContact.phoneNumber = phoneNumber;
      primaryContact.linkPrecedence = 'primary';
      await contactRepository.save(primaryContact);
      return res.json({
        contact: {
          primaryContactId: primaryContact.id,
          emails: email ? [email] : [],
          phoneNumbers: phoneNumber ? [phoneNumber] : [],
          secondaryContactIds: []
        }
      });
    }

    const emails = new Set([primaryContact.email]);
    const phoneNumbers = new Set([primaryContact.phoneNumber]);
    const secondaryContactIds = [];

    contacts.forEach(contact => {
      if (contact.id !== primaryContact.id) {
        if (contact.email) emails.add(contact.email);
        if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
        secondaryContactIds.push(contact.id);
      }
    });

    if ((email && !emails.has(email)) || (phoneNumber && !phoneNumbers.has(phoneNumber))) {
      const secondaryContact = new Contact();
      secondaryContact.email = email;
      secondaryContact.phoneNumber = phoneNumber;
      secondaryContact.linkedId = primaryContact.id;
      secondaryContact.linkPrecedence = 'secondary';
      await contactRepository.save(secondaryContact);
      secondaryContactIds.push(secondaryContact.id);
      if (email) emails.add(email);
      if (phoneNumber) phoneNumbers.add(phoneNumber);
    }

    res.json({
      contact: {
        primaryContactId: primaryContact.id,
        emails: Array.from(emails).filter(Boolean),
        phoneNumbers: Array.from(phoneNumbers).filter(Boolean),
        secondaryContactIds
      }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
