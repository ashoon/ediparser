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
  
  var jsonData =[];
  readOptions = {
    componentDataElementSeparator: '*',
    dataElementSeparator: '*',
    decimalNotation: '.',
    releaseCharacter: '>',
    reserved: '+',
    segmentTerminator: '\~',
    quote: null, // not used in EDI
    columns: null,
    flags: 'r',
    encoding: 'utf8',
    bufferSize: 8 * 1024 * 1024,
    trim: false,
    ltrim: false,
    rtrim: false
};
  
  edi()
        .from(ediData, readOptions)
        //.toStream(process.stdout)
        .transform(function(data){
          data.unshift(data.pop());
          console.log(data);
          return data;
        })
        .on('data',function(data,index){
          console.log('#'+index+' '+JSON.stringify(data));
          jsonData.push (data);
        })
        .on('end',function(count){
          res = res.type('application/json');
          res = res.status(200);
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