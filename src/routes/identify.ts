import { Router } from 'express';
import { Connection } from 'typeorm';
import { identifyContact } from '../controllers/identify-controller';
import { getContactById, getContactByEmail, getContactByPhoneNumber } from '../controllers/contact-controller';
import { Contact } from '../entity/contact';

const router = Router();

export default (connection: Connection) => {
  const contactRepository = connection.getRepository(Contact);

  router.post('/identify', identifyContact(contactRepository));

  router.get('/contactByEmail/:email', getContactByEmail(contactRepository));
  router.get('/contactByPhoneNumber/:phoneNumber', getContactByPhoneNumber(contactRepository));
  router.get('/contact/:id', getContactById(contactRepository));

  return router;
};
