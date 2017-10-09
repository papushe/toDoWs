let TODO = require('../models/todo'),
    USER = require('../models/user'),
    cGetAllTodo = 0,
    cLogin = 0,
    cCreateNewToDo = 0,
    cCreateNewUser = 0,
    cDropToDo = 0,
    cErrorHandling = 0;


const   log4js = require('log4js'),
        logger = log4js.getLogger('logs');
logger.level = 'info';
log4js.configure({
    appenders: { logs: { type: 'file', filename: 'logs.log' } },
    categories: { default: { appenders: ['logs'], level: 'info' } }
});

    exports.errorHandling = function (req, res) {
        cErrorHandling++;
        logger.info(`error 404 - not found (Wrong input or Wrong url, called: ${cErrorHandling}`);
        res.json({"error": "404 - not found (Wrong input or Wrong url)"});
    };

    exports.createNewUser = function (req, res) {
        let newUser = new USER({
            password: req.body.password,
            userName: req.body.userName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            date: createNewDate()
        });
        newUser.save(
            (err, data) => {
                if (err) {
                    logger.info(`something went wrong - User was not create properly!: ${err}`);
                    res.json(err);
                }
                res.json(data);
                logger.info(`new User: ${newUser} was been created successfully`);
                cCreateNewUser++;
                logger.info(`The Api: createNewUser called: ${cCreateNewUser}`);
            }
        );
    };
    exports.createNewToDo = function (req, res) {
    let newToDO = new TODO({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        date: createNewDate(),
        whatToDo: req.body.whatToDo,
        title: req.body.title
    });
    newToDO.save(
        (err) => {
            if (err) {
                logger.info(`something went wrong - toDo was not saved properly!: ${err}`);
                res.json(err);
            }
            logger.info(`new toDo: ${newToDO} was been saved successfully`);
            cCreateNewToDo++;
            logger.info(`The Api: createNewToDo called: ${cCreateNewToDo}`);
        }
    );
};
    exports.getAllToDo = function (req, res) {
        TODO.find({email:{$eq:req.params.email}},
            (err, data) => {
                if (err) {
                    logger.info(`query error: ${err}`);
                    res.json(err);
                }
                cGetAllTodo++;
                logger.info(`The Api: getAllTest called: ${cGetAllTodo}`);
                res.json(data);
            })
    };

    exports.login = function (req, res) {
        USER.find({email:{$eq:req.params.email}},
            (err, data) => {
            if (err) {
                logger.info(`query error: ${err}`);
                res.json(err);
                return;
            }
            if(data.length){
                if(data[0].email == req.params.email){
                    if(data[0].password == req.params.password){
                        cLogin++;
                        logger.info(`The Api: login called: ${cLogin}`);
                        res.json(data);
                    } else{
                        logger.info(`The Api: login called: ${cLogin}`);
                        res.send({ error: 'Wrong Password' })
                    }
                }
            } else {
                res.send({ error: 'Wrong Email' })
            }
        })
    };

    exports.dropToDo = function (req, res) {
    TODO.find({title:{$eq:req.params.title}},
        (err, data) => {
            if (err) {
                logger.info(`query error: ${err}`);
                res.json(err);
            }
            TODO.remove({_id:{$eq:data[0]._id}},
                (err,toDo) => {
                    if (err) {
                        logger.info(`query error: ${err}`);
                        res.json(err);
                    }
                    else logger.info(`${toDo} was deleted successfully!`);
                    cDropToDo++;
                    logger.info(`TThe Api: dropToDo called:${cDropToDo}`);
                });
        })
    };

    getRandomString =function(length) {
    length = 10;
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
    fixTime = function(minutes, second){
    if(second < 10 && second >= 0){
        second = '0'+second;
    }
    if(minutes < 10 && minutes >= 0){
        minutes = '0'+minutes;
    }
    return minutes+':'+second;
};
    createNewDate = function () {
    let date = new Date(),
        dataTime = date.getDate(),
        monthIndex = date.getMonth(),
        year = date.getFullYear(),
        fullDate = dataTime +'-' +  monthIndex + '-' + year,
        hour = date.getHours(),
        minutes = date.getMinutes(),
        second = date.getSeconds();
console.log(fullDate + ', '+ hour + ':'+ fixTime(minutes,second));
    return fullDate + ', '+ hour + ':'+ fixTime(minutes,second);
};

// exports.getTracksByMixName = function (req, res) {
//         MIX.find({mix_name:{$eq:req.params.mixName}},'-_id',
//             (err,mix) => {
//                 if (err) logger.log('magneto-stream', `query error: ${err}`);
//                 TRACK.find({track_id:{$in: mix[0].tracks_id}},
//                     (err, tracks ) => {
//                         if (err) logger.log('magneto-stream', `query error: ${err}`);
//                         cgetTracksByMixName++;
//                         logger.log('magneto-stream', `The Api: getTracksByMixName called:${cgetTracksByMixName}`);
//                         res.json(tracks);
//                 });
//             });
//     };
//
//     exports.getRandomTracks = function (req, res) {
//         TRACK.aggregate({ $sample: { size: parseInt(req.params.trackCount) }},
//             (err, tracks) => {
//                 if (err) logger.log('magneto-stream', `query error: ${err}`);
//                 cgetRandomTracks++;
//                 logger.log('magneto-stream', `The Api: getRandomTracks called:${cgetRandomTracks}`);
//                 res.json(tracks);
//             })
//
//     };
//
//     exports.getRandomMixes = function (req, res) {
//         MIX.aggregate({ $sample: { size: parseInt(req.params.mixCount) }},
//             (err, mix) => {
//                 if (err) logger.log('magneto-stream', `query error: ${err}`);
//                 cgetRandomMixes++;
//                 logger.log('magneto-stream', `The Api: getRandomMixes called:${cgetRandomMixes}`);
//                 res.json(mix);
//             })
//     };
//
