import { Request, Response, Router } from 'express';
import { Connection, Repository, getRepository } from 'typeorm';
import { Contact } from '../entity/contact';

const router = Router();

export default (connection: Connection) => {
  const contactRepository: Repository<Contact> = connection.getRepository(Contact);

  router.post('/identify', async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({ error: "At least one of email or phoneNumber is required" });
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
  });

  router.get('/contactByEmail/:email', async (req: Request, res: Response) => {
    const email = req.params.email;

    try {
      const contact = await contactRepository.findOne({ where: { email } });

      if (!contact) {
        return res.status(404).json({ error: `Contact with email ${email} not found` });
      }

      res.json({ contact });
    } catch (error) {
      console.error('Error fetching contact by email:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/contactByPhoneNumber/:phoneNumber', async (req: Request, res: Response) => {
    const phoneNumber = req.params.phoneNumber;
  
    try {
      const contact = await contactRepository.findOne({ where:{ phoneNumber }});
  
      if (!contact) {
        return res.status(404).json({ error: `Contact with phone number ${phoneNumber} not found` });
      }
  
      res.json({ contact });
    } catch (error) {
      console.error('Error fetching contact by phone number:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.get('/contact/:id', async (req: Request, res: Response) => {
    const contactId = parseInt(req.params.id, 10);

    try {
      const contact = await contactRepository.findOneBy({ id: contactId });

      if (!contact) {
        return res.status(404).json({ error: `Contact with ID ${contactId} not found` });
      }

      res.json({ contact });
    } catch (error) {
      console.error('Error fetching contact by ID:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  return router;
};
