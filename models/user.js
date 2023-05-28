const {Schema, model} = require("mongoose");
const Joi = require("joi");

const {MongooseError} = require("../helpers");


const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
      },
      email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
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
    password: Joi.string().required().messages({"any.required": `missing required password field`}),
    email: Joi.string().required().messages({"any.required": `missing required email field`}),
    subscription: Joi.string(),

})

const loginSchema = Joi.object({
    password: Joi.string().required().messages({"any.required": `missing required password field`}),
    email: Joi.string().required().messages({"any.required": `missing required email field`}),
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