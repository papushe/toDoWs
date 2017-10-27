const   express = require('express'),
        app = express(),
        toDo = require('./controllers/toDoController'),
        PORT   = require('./config').PORT,
        bodyParser = require('body-parser'),
        port = PORT ||process.env.PORT,
        portChat = process.env.PORT || 5000,
        http = require('http').Server(app);
        // io = require('socket.io')(http);


var io = require('socket.io')(http, {
    log: false,
    agent: false,
    origins: '*:*',
    transports: ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling']
});
app.use(bodyParser.json()); // parsing application/json
app.use(bodyParser.urlencoded({extended:true})); // parsing application/x-www-form-urlencoded
app.use('/', express.static('./public'));
app.use('/assets', express.static(`${__dirname}/public`)); // public as assets
app.use((req, res, next) => {
    // res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Origin", "http://www.papushe.com");
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", `Content-Length, Authorization, Origin, X-Requested-With, Content-Type, Accept, application/json`);
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

app.listen(PORT, () => {console.log(`listening on port ${PORT}`);});

io.on('connection', (socket) => {

    console.log('user connected');

    socket.on('newConnection', (message, userName) => {
        console.log('newConnection');
        io.emit('message', {type:'subscribe', text:'New user, ', userName:userName});
    });

    socket.on('disconnect', (message, userName) => {
        console.log('new disconnecting');
        io.emit('message', {type:'user-disconnect', text:`User disconnect`, userName:userName});
    });

    socket.on('add-message', (message, userName) => {
        console.log('new message');
        io.emit('message', {type:'new-message', text: message, userName:userName});
    });
});

http.listen(portChat, () => {
    toDo.getPortNumber(portChat);
    console.log(`started on port ${portChat}`);
});