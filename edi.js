var express = require('express');
var http = require('http');
const {  
  X12Generator,
  X12Parser,
  X12TransactionMap
} = require('node-x12')
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.text({
  type: function(req) {
    return 'text';
  }
}));

app.post('/ediToJson', function (req, res) {
  //console.log(req.body);
  ediData = req.body;

  const parser = new X12Parser(true)
  let interchange = parser.parse(ediData)


  res = res.type('application/json');
  res = res.status(200);
  res.send(interchange);
  
  
});

http.createServer(app).listen(3001);