let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let app = express();

let expressHbs = require('express-handlebars');  
app.engine(  
    'hbs',  
    expressHbs({  
      layoutsDir: 'views/layouts/',  
      defaultLayout: 'main-layout',  
      extname: 'hbs'  
    })  
  );  
app.set('view engine', 'hbs');  
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
app.use(bodyParser.text());

var routes = require('./routes/routes.js');

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname,'public', 'index.html'))
})

app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`On localhost:${ PORT }`);
});

