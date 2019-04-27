const express = require("express");
const database = require('../database');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router = express.Router();

router.post("/signup",async (req,res,next) => {

  bcrypt.hash(req.body.password,10)
    .then(async hash =>  {
      try{
      const result = await database.simpleExecute(
        "INSERT INTO Users(email,password,name,phonenumber,postalcode,city,street,streetnumber) VALUES ('"
        + req.body.email + "','" + hash + "','" + req.body.name + "'," + req.body.phoneNumber + "," + req.body.postalCode
         + ",'" + req.body.city + "','" + req.body.street + "'," + req.body.streetNumber + ")");
         res.status(201).json({
           message: "User created",
         })
      } catch(err) {
        res.status(500).json({
          message: 'Something went wrong!'
        })
      } finally {

      }
    });

});

router.post("/login", async (req,res,next) => {
  const result = await database.simpleExecute("SELECT email,password,id FROM Users WHERE email= '" + req.body.email + "'");
  if(!result.rows[0]) {
    return res.status(401).json({
      message: "Auth failed"
    });
  }
  bcrypt.compare(req.body.password,result.rows[0].PASSWORD)
    .then(hash => {
      if (!hash) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign({email: result.rows[0].EMAIL, userId: result.rows[0].ID  }, "secret_this_should_be_longer",
        { expiresIn: '1h'});
      res.status(200).json({
        token:token
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});

module.exports = router;
