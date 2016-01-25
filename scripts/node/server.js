import config  from '../../webpack.config.js';
import path  from 'path';
import express  from 'express';
import webpack  from 'webpack';

var app = express();
var compiler = webpack(config);
app.use(express.static(path.join(__dirname,'build')));

console.log(config.output.publicPath);
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('/:module/:page', function(req, res) {
  res.sendFile(path.join(__dirname,"../../src/app/",req.params.module+"/"+req.params.page+'.html'));
});

var port = 3000;
app.listen(port,  function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:'+port);
});
