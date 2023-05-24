const express = require('express')

const contactsController = require("../../controllers/contact-controllers");

const schemas = require("../../schemas/contact-schema");
const updateFavoriteSchema = require("../../schemas/contact-schema");

const {validateData, emptyBodyError, updateStatusError} = require("../../decorators");

const router = express.Router()



router.get('/', contactsController.listContacts);

router.get('/:id', contactsController.getContactById);

router.post('/',validateData(schemas.contactsSchema), contactsController.addContact);

router.delete('/:id', contactsController.removeContact);

router.put('/:id', emptyBodyError, validateData(schemas.contactsSchema), contactsController.updateContact);

router.patch('/:id/favorite',updateStatusError, validateData(updateFavoriteSchema), contactsController.updateStatusContact);

module.exports = router
 