const joi = require('joi')

//Validation
const registerValidation = async (data) => {
    const schema = new joi.object({
        name: joi.string().min(6).required(),
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required()
    })
    const validate = await schema.validateAsync(data)
    return validate 
}
const loginValidation = async (data) => {
    const schema = new joi.object({
        email: joi.string().min(6).required().email(),
        password: joi.string().min(6).required()
    })
    const validate = await schema.validateAsync(data)
    return validate 
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation