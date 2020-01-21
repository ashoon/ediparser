var express = require('express');
var http = require('http');
var edi = require('./lib/edi');
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
  res = res.status(200);
  
  var jsonData =[];
  edi()
        .from(ediData)
        //.toStream(process.stdout)
        .transform(function(data){
          data.unshift(data.pop());
          console.log(data);
          return data;
        })
        .on('data',function(data,index){
          console.log('#'+index+' '+JSON.stringify(data));
          jsonData.push(data);
        })
        .on('end',function(count){
          res = res.type('application/json');
          res.send(jsonData);
        })
        .on('error',function(error){
          console.log(error.message);
        });
        // .on('data',function(data,index){
        //   console.log(JSON.stringify(data));
        //   return JSON.stringify(data);
        // });

  
});

http.createServer(app).listen(3001);