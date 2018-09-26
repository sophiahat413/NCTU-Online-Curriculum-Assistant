var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var query = require('../../../db/msql');
var utils = require('../../../utils');

router.get('/students/profile', function(req, res){

    if(req.session.profile){
        var studentId = utils.getPersonId(JSON.parse(req.session.profile));

        if(!studentId){
              console.log("No Student Id");
              return;
        }
        query.findPerson(studentId, function(err,result){
            if(err){
                console.log("Can't find student");
                throw err;
                return;
            }
            if(!result){
                return;
            }
            console.log("profile in profile:");
            console.log(result);
	    //req.session.profile = result;
	    res.send(result);
	    //query.close();
        });
    }
    else{
        res.redirect('/');
	return;
    }

});

module.exports = router;

