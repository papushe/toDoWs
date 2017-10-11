const   express = require('express'),
        app = express(),
        toDo = require('./controllers/toDoController'),
        PORT   = require('./config').PORT,
        bodyParser = require('body-parser'),
        port = process.env.PORT || PORT;

app.set('port',port);
app.use(bodyParser.json()); // parsing application/json
app.use(bodyParser.urlencoded({extended:true})); // parsing application/x-www-form-urlencoded
app.use('/', express.static('./public'));
app.use('/assets', express.static(`${__dirname}/public`)); // public as assets
app.use(
    (req,res,next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    });

/* All routes  */
app.get('/', (req,res) =>{
    res.sendFile(`${__dirname}/index.html`);
});

app.post('/login/', toDo.login);

app.post('/changePassword/', toDo.changePassword);

app.post('/createNewUser/', toDo.createNewUser);

app.get('/getAllToDo/:email', toDo.getAllToDo);

app.post('/createNewToDo/', toDo.createNewToDo);

app.get('/dropToDo/:title', toDo.dropToDo);

app.all('*', toDo.errorHandling);

app.listen(port, () => {console.log(`listening on port ${port}`);});