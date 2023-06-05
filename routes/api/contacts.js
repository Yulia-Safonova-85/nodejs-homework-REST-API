const express = require('express')

const contactsController = require("../../controllers/contact-controllers");

const schemas = require("../../schemas/contact-schema");


const {validateData, emptyBodyError, updateStatusError} = require("../../decorators");
const authenticate = require ("../../middlewares/authenticate");
const upload = require ("../../middlewares/upload");

const router = express.Router()

router.use(authenticate);


router.get('/', contactsController.listContacts);

router.get('/:id', contactsController.getContactById);

router.post('/', upload.single("avatar"), validateData(schemas.contactsSchema), contactsController.addContact);

router.delete('/:id', contactsController.removeContact);

router.put('/:id', emptyBodyError, validateData(schemas.contactsSchema), contactsController.updateContact);

router.patch('/:id/favorite', updateStatusError, validateData(schemas.updateFavoriteSchema), contactsController.updateStatusContact);

module.exports = router
 