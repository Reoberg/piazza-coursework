const joi = require('joi')

const registerValidation = (data)=> {
    const schemaValidation = joi.object({
        username: joi.string().required().min(3).max(256),
        email: joi.string().required().min(3).max(256).email(),
        password: joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}
const loginValidation = (data)=> {
    const schemaValidation = joi.object({
        email: joi.string().required().min(3).max(256).email(),
        password: joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

const postValidation = (data) => {
    const schemaValidation = joi.object({
        title: joi.string().required().min(1).max(64),
        categories: joi.string().required().min(1).max(64),
        message_body: joi.string().required().min(1).max(64),
    })
    return schemaValidation.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.postValidation = postValidation
