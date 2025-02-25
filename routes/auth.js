const express = require('express')
const router = express.Router()

const User = require("../models/User")
const {registerValidation, loginValidation} = require("../validations/validation")

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
router.post('/register', async (req, res) => {

 //Validation 1 to check user input
  const {error} =  (registerValidation(req.body))
  if (error){
    res.status(400).send(error['details'][0].message)
  }

  //Validation 2 to check if user exist!
  const userExists = await User.findOne({email:req.body.email})
  if(userExists){
    return res.status(400).send({message:"User already exist"})
  }

  const  salt = await bcryptjs.genSalt(5)
  console.log(req.body.password)
  const  hashedPassword = await bcryptjs.hash(req.body.password,salt)
// Code to register User
  const user = new User({
    username:req.body.username,
    email:req.body.email,
    password:hashedPassword
  })
try {
  const savedUser = await user.save()
  res.send(savedUser)
}
  catch (err){
     res.status(400).send({message:err})
  }

})

router.post('/login', async (req, res) =>{
  //Validation 1  to check user input
  const {error} =  (loginValidation(req.body))
  if (error){
    res.status(400).send(error['details'][0].message)
  }
  // Validation 1 to check user exist
  const user = await User.findOne({email:req.body.email})
  if(!user){
    return res.status(400).send({message:"User does not exist"})
  }


  //Validation 2 to check is user exist
  const passwordValidation = await bcryptjs.compare(req.body.password,user.password)
  if(!passwordValidation){
    return res.status(400).send({message:"Password is wrong!"})
  }

  //Generate an auth-token
  const token = jsonwebtoken.sign({_id:user._id, username:user.username}, process.env.TOKEN_SECRET)
  res.header('auth-token',token).send({'auth-token': token} )

})
module.exports = router