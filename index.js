var http = require('http');
var express = require('express');
var app = express();
var path = require('path');
var gm = require('gm');
var fs = require('fs');
var url = require('url');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var passportSocketIo = require("passport.socketio");
var flash    = require('connect-flash');
var redis = require("redis"),
    redisClient = redis.createClient();
 
    redisClient.on("connect", function () {
        // if(!redisClient.exists('id-msg')){
        //     redisClient.set('id-msg',1)
        // }
        console.log("connect redis ");
    });
    redisClient.on("error", function (err) {
        console.log("Error " + err);
    });

var models = require('./models');
//MODEL
require(__dirname + '/app/models/user.js');
require(__dirname + '/app/models/category.js');
require(__dirname + '/app/models/entry.js');
var favicon = require('serve-favicon'),
  logger = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  multer  = require('multer'),
  expressSession = require('express-session'),
  csrf = require('csurf'),
  validator = require('express-validator');
  errorHandler = require('errorhandler');

var RedisStore = require('connect-redis')(expressSession),
   sessionStore = new RedisStore({ // Create a session Store
      host: '127.0.0.1',
      port: 6379,
   });

app.set('port',process.env.PORT || 3000); 
app.set('views',__dirname + '/app/views');
app.set('view cache', true);
app.set('view engine','jade');

require('./config/passport')(passport);

app.use(favicon(path.join('public','favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSession({ 
            store: sessionStore,
            secret: 'okthxbyeokthxbyeokthxbyeoGthxbyeokth1byeokthxbye', 
            resave:true,
            key: 'user', 
            saveUninitialized:true,
            cookie: { maxAge: 3600000, secure: false }
          }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(validator());
app.use(methodOverride());
//app.use(csrf());
app.use(express.static(path.join(__dirname, 'public')));
var dbUrl = process.env.MONGOHQ_URL || 'mongodb://@127.0.0.1:27017/myBlog';
var mongoose = require('mongoose');

// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(dbUrl, options);
  mongoose.connection.once('open', function () {
    console.info('Connected to database')
  })
};
connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

require('./app/routes')(app,passport);
app.use(errorHandler());

var server = http.createServer(app);
var io = require('socket.io').listen(server);

function onAuthorizeSuccess(data, accept){  
  console.log('successful connection to socket.io');
  accept(); //Let the user through
}

function onAuthorizeFail(data, message, error, accept){ 
  if(error) accept(new Error(message));
  console.log('failed connection to socket.io:', message);
  accept(null, false);  
}

io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,       // the same middleware you registrer in express 
  key:          'user',       // the name of the cookie where express/connect stores its session_id 
  secret:       'okthxbyeokthxbyeokthxbyeoGthxbyeokth1byeokthxbye',    // the session_secret to parse the cookie 
  store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please 
  success:      onAuthorizeSuccess,  // *optional* callback on success - read more below 
  fail:         onAuthorizeFail,     // *optional* callback on fail/error - read more below 
}));


io.sockets.on('connection', function (socket) {
  //console.log(' connection to socket.io: TuanPA');
  var userConnect = socket.request.user;
  socket.on('room-message-send',function(msg){
      console.log(msg);
      redisClient.incr('id-msg',function(err, reply) {
       var msgId = reply;
       var userId = userConnect.username == 'tuanpa' ? 1 : 2;
       redisClient.zadd('room',userId,msgId);
       redisClient.zadd('msg',msgId,msg);
      });
      
  });
    


  socket.on('disconnect', function(){
    console.log('disconnect socket.io');
  });
});


server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// app.listen(app.get('port'),function(){
// 	console.log('hello world ' + app.get('port'));
//   console.log(url.href);
// });

