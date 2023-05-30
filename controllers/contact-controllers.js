const Contact = require("../models/contact");

const {HttpError} = require("../helpers");

const listContacts = async (req, res, next) => {
    try{
      const {_id: owner} = req.user;
      const { page = 1, limit = 20 } = req.query;
	    const skip = (page - 1) * limit;
      const result = await Contact.find({owner},"-createdAt -updatedAt", {skip, limit}).populate("owner","email, subscription");
      res.json(result)
  }
    catch(error){
      next(error);
    }
  }

  const getContactById = async (req, res, next) => {
    try{
      const {id} = req.params;
      const result = await Contact.findById(id);
      if (!result){
        throw HttpError(404, `Not found`);
        }
      res.json(result)
    }
    catch(error){
     next(error);
    }
  }

  const addContact = async (req, res) => {
    try{
        const {_id: owner} = req.user;
        const result = await Contact.create({...req.body, owner});
        res.status(201).json(result);
    }
      catch(error){
        next(error);
      }
    }
    
  const removeContact = async (req, res, next) => {
    try{
      const {id} = req.params;
      const result = await Contact.findByIdAndRemove(id);
      if(!result){
        throw HttpError(404, `Not found`);
        }
      res.status(200).json({message: "contact deleted"});
    }
    catch(error){
      next(error)
    }
  }

  const updateContact = async (req, res, next) => {
    try{
      const {id} = req.params;
      const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
      if(!result){
        throw HttpError(404, `Not found`);
        }
      res.json(result); 
    }
      catch(error){
        next(error)
      }
    }

    const updateStatusContact = async (req, res, next) => {
      try{
        const {id} = req.params;
        const result = await Contact.findByIdAndUpdate(id, req.body, {new: true});
        if(!result){
          throw HttpError(404, `Not found`);
          }
        res.json(result); 
      }
        catch(error){
          next(error)
        }
      }
   
    
  module.exports = {
    listContacts,
    getContactById,
    addContact,
    removeContact,
    updateContact,
    updateStatusContact,

  }