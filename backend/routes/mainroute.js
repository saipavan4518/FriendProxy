const router = require('express').Router();
const verify  = require('./verifyToken');

router.get('/', verify,(req,res) =>{
    res.status(200).send({
        serverDetails:"UNKNOWN",
        createdBy:"SaiPavan",
        Location:"34.3030N 56.324S",
        object:req.user
        
    });
});

module.exports = router;
