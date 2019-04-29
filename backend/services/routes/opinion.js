const express = require("express");
const database = require('../database');
const checkAuth = require('../../middleware/check-auth');

const router = express.Router();


router.get('/comments/:id', async (req, res, next) => {

  const result = await database.simpleExecute(" SELECT * FROM Comments WHERE PRODUCT_ID = " + req.params.id);
  if (result.rows) {
    res.status(200).json({
      comments: result.rows
    });
  } else {
    res.status(500).json({
      message: 'Something went wrong!'
    });
  }

});

router.post('/comments/:id', checkAuth, async (req, res, next) => {
  productId = req.params.id;
  userId = req.userData.userId;
  content = req.body.content;
  commentDate = new Date();
  try{
    const result = await database
      .simpleExecute(" INSERT INTO Comments VALUES (" + productId + ", " + userId + ", '" + content +  "', TO_DATE('" + commentDate.toLocaleDateString() + "', 'YYYY-MM-DD') )");
    res.status(200).json({
      message: "Comment inserted"
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong!'
    });
  }
});

router.get('/rating/:id', async (req, res, next) => {
  productId = req.params.id;
  try {
    const result = await database.simpleExecute("SELECT AVG(RATEVALUE)  as rating, COUNT(RATEVALUE) as rateCount FROM Rates WHERE PRODUCT_ID = " + productId);
    res.status(200).json({
      rating: result.rows[0].RATING,
      count: result.rows[0].RATECOUNT
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Something went wrong!'
    })
  }
});


module.exports = router;