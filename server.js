const   express = require('express'),
        app = express(),
        toDo = require('./controllers/toDoController'),
        PORT   = require('./config').PORT,
        port = PORT || process.env.PORT,
        portChat = process.env.PORT || 5000,
        bodyParser = require('body-parser'),
        http = require('http').Server(app),
        cors = require('cors');
        // cookieSession = require('cookie-session');
        // io = require('socket.io')(http);
let     users = [],
        connections = [],
        messages = [],
        io = require('socket.io')(http, {
            log: false,
            agent: false,
            origins: '*:*',
            transports: ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling', 'xdr-streaming', 'xdr-polling', 'xhr-polling', 'xdr-streaming','iframe-xhr-polling', 'jsonp-polling' ],
            pollingDuration: 10,
            path: '/socket.io'
        }),
        corsOptions = {
            origin: "*",
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        };

app.use(cors(corsOptions));
app.use(bodyParser.json()); // parsing application/json
app.use(bodyParser.urlencoded({extended:true})); // parsing application/x-www-form-urlencoded
app.use('/', express.static('./public'));
app.use('/assets', express.static(`${__dirname}/public`)); // public as assets
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true); //false
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Length, Authorization, Origin, X-Requested-With, Content-Type, Accept, application/json");
    next();
});
/* All routes  */
app.get('/', (req,res) =>{
    res.sendFile(`${__dirname}/index.html`);
});

app.post('/login/', toDo.login);

app.post('/changePassword/', toDo.changePassword);

app.post('/updateAllToDo/', toDo.updateAllToDo);

app.post('/createNewUser/', toDo.createNewUser);

// app.get('/getAllToDo/:email', toDo.getAllToDo);
app.post('/getAllToDo/', toDo.getAllToDo);

app.post('/createNewToDo/', toDo.createNewToDo);

app.post('/dropToDo/', toDo.dropToDo);

// app.post('/sendmail/', toDo.sendmail);

app.all('*', toDo.errorHandling);

app.listen(port, () => {console.log(`listening on port ${port}`);});

io.sockets.on('connection', (socket) => {

    socket.on('new-connection', (data, callback) => {

        connections.push(socket);
        console.log('Connected: %s sockets connected', connections.length);

        socket.username = callback;
        users.push(socket.username);
        console.log(`New-connection ${socket.username}`);
        io.sockets.emit('message', {type:'subscribe', text:'Connected', userName:callback});

    });

    socket.on('connect_failed', function (data) {
        console.log('connect_failed');
        io.sockets.emit('connect_failed', {type:'TransportError', text:'TransportError', data:data});
    });

    socket.on('connect_error', function (data) {
        console.log('connect_error');
        io.sockets.emit('connect_error', {type:'connect_error', text:'connect_error', data:data});
    });

    socket.on('new-message', (message, callback) => {
        messages.push(`${callback} - New message: ${message}`);
        io.sockets.emit('message', {type:'new-message', text: message, userName:callback});
    });

    socket.on('disconnect', () => {

        io.sockets.emit('message', {type:'user-disconnect', text:`Disconnected`, userName:socket.username});

        console.log(`${socket.username} - is disconnected`);

        users.splice(users.indexOf(socket.username),1);
        connections.splice(connections.indexOf(socket), 1);
        console.log(`Disconnected: ${connections.length} sockets connected ${users}`);
    });

});

http.listen(portChat, () => {
    toDo.getPortNumber(portChat);
    console.log(`started on port ${portChat}`);
});