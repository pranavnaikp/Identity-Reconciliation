import { Request, Response } from 'express';
import { Repository } from 'typeorm';
import { Contact } from '../entity/contact';

export const getContactByEmail = (contactRepository: Repository<Contact>) => async (req: Request, res: Response) => {
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
};

export const getContactByPhoneNumber = (contactRepository: Repository<Contact>) => async (req: Request, res: Response) => {
  const phoneNumber = req.params.phoneNumber;

  try {
    const contact = await contactRepository.findOne({ where: { phoneNumber } });

    if (!contact) {
      return res.status(404).json({ error: `Contact with phone number ${phoneNumber} not found` });
    }

    res.json({ contact });
  } catch (error) {
    console.error('Error fetching contact by phone number:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getContactById = (contactRepository: Repository<Contact>) => async (req: Request, res: Response) => {
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
};
