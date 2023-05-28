const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {User} = require("../models/user");

const {HttpError} = require("../helpers");

const {SECRET_KEY} = process.env;

const register = async (req, res, next) => {
        try{
         const {email, password} = req.body;
         const user = await User.findOne({email});

         if(user){
            throw HttpError(409, "Email in use");
         }

         const hashPassword = await bcrypt.hash(password, 10);

          const newUser = await User.create({...req.body, password: hashPassword});
          res.status(201).json({
            email: newUser.email,
            
          })
      }
        catch(error){
          next(error);
        }
      }

      const login = async(req, res, next) => {
        try{
            const {email, password} = req.body;
            const user = await User.findOne({email});
   
            if(!user){
               throw HttpError(401, "Email or password is wrong");
            }
   
            const passwordCompare = await bcrypt.compare(password, user.password);
   
            if(!passwordCompare){
                throw HttpError(401, "Email or password is wrong");
            }

            const {_id: id} = user;
            const payload = {
              id,
            }

            const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "23h"});
            await User.findByIdAndUpdate(id, {token});

             res.json({
               token,
               
             })
         }
           catch(error){
             next(error);
           }
      }

  const getCurrent = async(req, res, next) => {
        try{
            const {email} = req.user;
           
            res.json({
              email,
           })
         }
           catch(error){
             next(error);
           }
      }

const logout = async(req, res, next) => {
  try{
      const {_id} = req.user;

      await User.findByIdAndUpdate(_id, {token: ""});
     
      res.status(204).json({
        message: "No Content"})
   }
     catch(error){
       next(error);
     }
}


module.exports = {
    register,
    login,
    getCurrent,
    logout,
}