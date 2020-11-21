const router = require('express').Router();
const User = require('../model/User');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation,LoginValidation} = require('../validation')
//Abbreviations used for the usecase of security
/*
IUSU: is user signed up
ILN: is logged in

isCC: is correct credintials
    isUSer: if the given user is already a user to the service
    in this code , we check for the username
    1.if not present, send the response as 
        isUser:False
        isCC:False
    2.if the user is present in the database and credintials are correct, send
        isUser:True
        isCC: True
        id: the object id of the user.
    3.if the user is present in the DB and credits are false then send
        isUSer:True
        isCC: false
    4.if there is error with the retrival, then
        log the error in the server
        and then the respose as 500
*/
router.route('/register').post(async (req,res) =>{
    //validating the user and creating the user account.
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details);

    //check if already this email is present
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send({errorID:1,details:"User Email is already present"});

    //hashing the password
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.password, salt)


    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPass
    });
    user.save()
        .then(() => res.send({IUSU:"true"}))
        .catch((error) => res.status(500).send(error));
});

router.route('/login').post(async (req,res) =>{
    // validate the user and then search the database
    const {error} = LoginValidation(req.body);
    if(error) return res.status(400).send(error.details);

    User.findOne({email: req.body.email})
        .then(async (result) =>{
            if(result === null){ 
                // if there is no account for the given user account.
                res.send({"isUser":false,"isCC":false}); 
            }
            const validatePass = await bcrypt.compare(req.body.password,result.password);
            if(!validatePass){
                //password is not matching
                res.send({"isUser":true,"isCC":false});
            }else{
                //user and the password is correct
                const token = jwt.sign({"user_id":result._id}, process.env.TOKEN_PASSWORD);
                res.header('auth-token',token).send(token)
            }
        })
        .catch((error) =>{
            res.status(500).send(error);
        });
});


module.exports = router;