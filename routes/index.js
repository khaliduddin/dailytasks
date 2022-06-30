var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/go', function(req, res, next){
  //res.sendFile( __dirname + "/" + "form.htm" );
  res.render('go', {title : 'Go to the New Page'});
});

router.post('/process_post', function (req, res) {
  // Prepare output in JSON format
  response = {
     first_name:req.body.f_name,
     last_name:req.body.l_name
  };

  res.render('process_post', {details : JSON.stringify(response)});
  console.log(response);
  //res.end(JSON.stringify(response));
});

module.exports = router;
