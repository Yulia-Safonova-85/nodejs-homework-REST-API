const fs = require("fs/promises");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {nanoid} = require("nanoid");

const gravatar = require("gravatar");
const Jimp = require("jimp");

const contactsPath = path.resolve("public", "avatars");

const {User} = require("../models/user");
const {HttpError, sendEmail} = require("../helpers");

const {SECRET_KEY} = process.env;

const register = async (req, res, next) => {
        try{
         const {email, password} = req.body;
         const user = await User.findOne({email});

         if(user){
            throw HttpError(409, "Email in use");
         }

         const hashPassword = await bcrypt.hash(password, 10);
         const avatarURL = gravatar.url(email);
         const verificationToken = nanoid();
         const newUser = await User.create({...req.body, password: hashPassword, avatarURL, verificationToken});

const verifyEmail = {
     to: email,
     subject:"Verification email sent",
     html: `<a target="_blank" href="http://localhost:3000/users/verify/${verificationToken}">Click to verify email</a>`
};
await sendEmail(verifyEmail);

          res.status(201).json({
            user:{
              email: newUser.email,
              subscription: newUser.subscription,
              avatarURL: newUser.avatarURL,
            }
          })
      }
        catch(error){
          next(error);
        }
      }

      const verify = async(req, res, next)=> {
        try{
         const {verificationToken} = req.params;
         const user = await User.findOne({verificationToken});
             if(!user){
                throw HttpError(404, "User not found");
                    }
          await User.findByIdAndUpdate(user._id, {verify: true, verificationToken:""});

           res.json({
              message: "Verification successful"
             })
        }
        catch(error){
          next(error);
        }
      };

      const resendVerifyEmail = async(req, res, next) => {
          try{
              const {email} = req.body;
              const user = await User.findOne({email});
              if(!user){
                throw HttpError(404, "User not found");
              }
              if(user.verify){
                throw HttpError(400, "Verification has already been passed");
              }
              const verifyEmail = {
                to: email,
                subject:"Verification email sent",
                html: `<a target="_blank" href="http://localhost:3000/users/verify/${verificationToken}">Click to verify email</a>`
           };
           await sendEmail(verifyEmail);

           res.json({
            message: "Verification email sent"
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
   
            if(!user || !user.verify){
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
               user: {
                email: user.email,
                subscription: user.subscription,
                avatarURL: user.avatarURL,
              }
             })
         }
           catch(error){
             next(error);
           }
      }

  const getCurrent = async(req, res, next) => {
        try{
            const {email,subscription} = req.user;
           
            res.json({
              email,
              subscription
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

const updateAvatar = async(req, res, next) => {
  try{
    const {_id} = req.user;
    const {path: oldPath, filename} = req.file;
    const newPath = path.join(contactsPath, filename);

    const avatar = await Jimp.read(oldPath);
    avatar.autocrop().cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER || Jimp.VERTICAL_ALIGN_MIDDLE).write(newPath);
    
    await fs.rename(oldPath, newPath);
    const avatarURL = path.join("avatars", filename);

    await User.findByIdAndUpdate(_id, {avatarURL});
     
    res.json({
      avatarURL
     })
  }
  catch(error){
    next(error);
  }
}


module.exports = {
    register,
    verify,
    resendVerifyEmail,
    login,
    getCurrent,
    logout,
    updateAvatar,
}