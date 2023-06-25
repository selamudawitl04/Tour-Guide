const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router({ mergeParams: true });
const contactController = require('../controllers/contactController')



router
  .route('/')
  .get(contactController.getAllContacts)
  .post(
    contactController.createContact
  );

router
  .route('/:id')
  .get(contactController.getContact)
  .patch(
    contactController.updateContact
  )
  .delete(
    // authController.restrictTo('user', 'admin'),
    contactController.deleteContact
  );

module.exports = router;
