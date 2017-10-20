const   express = require('express'),
        app = express(),
        toDo = require('./controllers/toDoController'),
        PORT   = require('./config').PORT,
        bodyParser = require('body-parser'),
        port = process.env.PORT || PORT,
        portChat = process.env.PORT || 5000,
        http = require('http').Server(app),
        io = require('socket.io')(http);

// app.set('port',port);
app.use(bodyParser.json()); // parsing application/json
app.use(bodyParser.urlencoded({extended:true})); // parsing application/x-www-form-urlencoded
app.use('/', express.static('./public'));
app.use('/assets', express.static(`${__dirname}/public`)); // public as assets
app.use(
    (req,res,next) => {
        // res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Origin", "http://www.papushe.com");
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

app.post('/dropToDo/', toDo.dropToDo);

app.all('*', toDo.errorHandling);

app.listen(4300, () => {console.log(`listening on port ${port}`);});

io.on('connection', (socket) => {
    console.log('user connected');

    socket.on('newConnection', (message, userName, port) => {
        console.log('newConnection');
        io.emit('message', {type:'subscribe', text:'New user, ', userName:userName, port:portChat});
    });

    socket.on('disconnect', (message, userName) => {
        console.log('disconnect');
        io.emit('message', {type:'user-disconnect', text:`User disconnect`, userName:userName});
    });

    socket.on('add-message', (message, userName) => {
        console.log('new message');
        io.emit('message', {type:'new-message', text: message, userName:userName});
    });
});
http.listen(portChat, () => {
    console.log(`started on port ${portChat}`);
});

// res.header("Access-Control-Allow-Origin", "http://www.papushe.com");

//dont forget Mongoose.prototype.connect