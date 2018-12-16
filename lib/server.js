//===========================================
// import dependencies
//===========================================
import express from 'express';
import config from './config';

//===========================================
// bring in application
//===========================================
const app = express();

//===========================================
// have express statically serve up the public directory
//===========================================
app.use(express.static('public'));

//===========================================
// create index route at /
// pass in a 'test' variable: "Hello world"
//===========================================
app.get('/', (req, res) => {
  res.render('index', {
    test: 'Hello world'
  });
});

//===========================================
// configure express to use ejs as the templating language
//===========================================
app.set('view engine', 'ejs');

//===========================================
// set up the app to listen on config.port
//===========================================
app.listen(config.port, () =>
  console.info(`Listening on PORT ${config.port}. . .`)
);
