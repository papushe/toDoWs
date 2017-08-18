const   express = require('express'),
        app = express(),
        toDo = require('./controllers/toDoController'),
        PORT   = require('./config').properties.PORT,
        port = process.env.PORT || PORT;

app.set('port',port);
app.use('/', express.static('./public'));
app.use('/assets', express.static(`${__dirname}/public`)); // public as assets
app.use(
    (req,res,next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

/* All routes  */
app.get('/', (req,res) =>{
    res.sendFile(`${__dirname}/index.html`);
});

app.get('/getAllToDo', toDo.getAllToDo);

app.get('/createNewToDo/:name/:title/:whatToDo', toDo.createNewToDo);

app.get('/dropToDo/:title', toDo.dropToDo);

// app.get('/getAllMixes', magneto.getAllMixes);
//
// app.get('/get/:mixName', magneto.getTracksByMixName);
//
// app.get('/getRandomTracks/:trackCount', magneto.getRandomTracks);
//
// app.get('/getRandomMixes/:mixCount', magneto.getRandomMixes);
//
// app.get('/createNewMix/:mixName/:creator/:trackId1/:trackId2/:trackId3', magneto.createNewMix);
//
// app.get('/dropMix/:mixName', magneto.dropMix);

app.all('*', toDo.errorHandling);

app.listen(port, () => {console.log(`listening on port ${port}`);});
