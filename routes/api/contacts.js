const express = require('express')

const contactsController = require("../../controllers/contact-controllers");

const schemas = require("../../schemas/contact-schema");
const {validateData, emptyBodyError} = require("../../decorators");

const router = express.Router()



router.get('/', contactsController.listContacts)

router.get('/:contactId', contactsController.getContactById)

router.post('/',validateData(schemas.contactsSchema), contactsController.addContact)

router.delete('/:contactId', contactsController.removeContact)

router.put('/:contactId', emptyBodyError, validateData(schemas.contactsSchema), contactsController.updateContact)

module.exports = router
 