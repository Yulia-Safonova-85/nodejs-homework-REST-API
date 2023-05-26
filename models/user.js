const {Schema, model} = require("mongoose");
const Joi = require("joi");

const {MongooseError} = require("../helpers");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: emailRegexp,
      },
      subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
      },
      token: String


}, {versionKey: false, timestamps: true});


userSchema.post("save", MongooseError);

const registerSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
    subscription: Joi.string(),

})

const loginSchema = Joi.object({
    password: Joi.string().required(),
    email: Joi.string().required(),
})

const schemas = {
    registerSchema,
    loginSchema,

}

const User = model("user", userSchema);

module.exports = {
    User,
    schemas,
}