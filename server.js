var express = require('express'),
  app = express();

app.set('port',process.env.PORT || 8000);

var server = app.listen(app.get('port'), function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://localhost:'+port);
});
require('./app_routes')(app);