const
  util = require("util"),
  http = require("http"),
  express = require('express'),
  path = require('path'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  authStrategies = require("./lib/auth/strategies"),
  appUtils = require("./lib/utils"),
  login = require("./routes/login"),
  signup = require("./routes/signup"),
  questions = require("./routes/questions"),
  passport = require("passport"),
  app = express()
;

passport
  .use("jwt", authStrategies.bearerStrategy)
  .use("local", authStrategies.localStrategy)
;

app
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'pug')
  .use(logger('dev'))
  .use(bodyParser.json())
  .use(cookieParser())
  .use(express.static(path.join(__dirname, 'public')))
  .use("/login", login)
  .use("/signup", signup)
  .use("/questions", questions)
  .use(appUtils.serverErrorHandler)
;

const server = http.createServer(app);
appUtils.extend(server);
server.listen(80, "127.0.0.1", function(){console.log(`server running on ${util.inspect(server.address(),{color: true, depth: null})}`)})
