var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('../../webpack.config.js');

var app = express();
var compiler = webpack(config);
app.use(express.static(path.join(__dirname,'build')));

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('/:context/:page', function(req, res) {
  res.sendFile(path.join(__dirname,"../../src/",req.params.context+"/"+req.params.page+'.html'));
});

var port = 3000;
app.listen(port, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:'+port);
});
