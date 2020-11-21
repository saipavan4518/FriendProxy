const Joi = require('joi');

function registerValidation(data){
    const mainSchema = Joi.object({
        username: Joi.string().min(6).alphanum().required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    return mainSchema.validate(data);
}

function LoginValidation(data){
    const mainSchema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });

    return mainSchema.validate(data);
}




module.exports.registerValidation = registerValidation;
module.exports.LoginValidation = LoginValidation;