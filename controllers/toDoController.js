let TODO = require('../models/todo');

const log4js = require('log4js');
var logger = log4js.getLogger('logs');
logger.level = 'info';
log4js.configure({
    appenders: { logs: { type: 'file', filename: 'logs.log' } },
    categories: { default: { appenders: ['logs'], level: 'info' } }
});

let cGetAllTodo = 0,
    cCreateNewToDo = 0,
    cDropToDo = 0,
    cHomePage = 0,
    cErrorHandling = 0;

    exports.goToHome = function (req, res) {
        cHomePage++;
        logger.info(`Home api, called: ${cHomePage} `);
        res.sendfile(`../${__dirname}/index.html`);
    };

    exports.errorHandling = function (req, res) {
        cErrorHandling++;
        logger.info(`error 404 - not found (Wrong input or Wrong url, called: ${cErrorHandling}`);
        res.json({"error": "404 - not found (Wrong input or Wrong url)"});
    };

    exports.getAllToDo = function (req, res) {
        TODO.find({},
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
exports.createNewToDo = function (req, res) {
    let newToDO = new TODO({
        name: req.params.name,
        date: createNewDate(),
        whatToDo: req.params.whatToDo,
        title: req.params.title
    });
    newToDO.save(
        (err) => {
            if (err) {
                logger.info(`something went wrong - toDo was not saved properly!: ${err}`);
                res.json(err);
            }
            logger.info(`new toDo: ${newToDO} was been saved successfully`);
            cCreateNewToDo++;
            logger.info(`The Api: createNewToDo called:${cCreateNewToDo}`);
        }
    );
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

fixTime = function(minutes){
    if(minutes == 0){
        return '00'
    }else if(minutes <10 && minutes>0){
        return '0'+minutes;
    }
    return minutes
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
console.log(fullDate + ', '+ hour + ':'+fixTime(minutes)+':'+second);
    return fullDate + ', '+ hour + ':'+fixTime(minutes)+':'+second;
}

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
