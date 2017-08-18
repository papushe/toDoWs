let TODO = require('../models/todo');

const log4js = require('log4js');
var logger = log4js.getLogger('logs');
logger.level = 'info';
log4js.configure({
    appenders: { logs: { type: 'file', filename: 'logs.log' } },
    categories: { default: { appenders: ['logs'], level: 'info' } }
});

let cGetAllTodo = 0;
let cCreateNewToDo = 0;

    exports.goToHome = function (req, res) {
        res.sendfile(`../${__dirname}/index.html`);
    };

    exports.errorHandling = function (req, res) {
        res.json({"error": "404 - not found (Wrong input or Wrong url)"});
    };

    exports.getAllTest = function (req, res) {
        TODO.find({}, '-__v -_id',
            (err, data) => {
                if (err) logger.info(`query error: ${err}`);
                cGetAllTodo++;
                logger.info(`The Api: getAllTest called: ${cGetAllTodo}`);
                res.json(data);
            })
    };

exports.createNewToDo = function (req, res) {
    let fullDate = new Date();
    let newToDO = new TODO({
        name: req.params.name,
        date: fullDate,
        whatToDo: req.params.whatToDo,
        title: req.params.title
    });
    newToDO.save(
        (err) => {
            if (err) logger.info(`something went wrong - mix was not saved properly!: ${err}`);
            logger.info(`new toDo: ${newToDO} was been saved successfully`);
            cCreateNewToDo++;
            logger.info(`The Api: createNewToDo called:${cCreateNewToDo}`);
        }
    );
};


//
//     exports.getAllMixes = function (req, res) {
//         MIX.find({},'-_id',
//             (err, data) => {
//                 if (err) logger.log('magneto-stream', `query error: ${err}`);
//                 cgetAllMixes++;
//                 logger.log('magneto-stream', `The Api: getAllMixes called:${cgetAllMixes}`);
//                 res.json(data);
//             })
//     };
//
//
//
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
//     exports.createNewMix = function (req, res) {
//         let length = 0;
//         TRACK.find({track_id:{$eq:req.params.trackId1}},
//             (err, tracks ) => {
//                 if (err) logger.log('magneto-stream', `query error: ${err}`);
//                 length = tracks[0].length;
//                 TRACK.find({track_id:{$eq:req.params.trackId2}},
//                     (err, tracks ) => {
//                         if (err) logger.log('magneto-stream', `query error: ${err}`);
//                         length += tracks[0].length;
//                         TRACK.find({track_id:{$eq:req.params.trackId3}},
//                             (err, tracks ) => {
//                                 if (err) logger.log('magneto-stream', `query error: ${err}`);
//                                 length += tracks[0].length;
//                                 let fullDate = new Date();
//                                 let newMix = new MIX({ mix_name: req.params.mixName,
//                                     creator: req.params.creator,
//                                     creation_date: fullDate,
//                                     img_src: 'assets/mixTiles/mix11.jpg',
//                                     length: length,
//                                     tracks_id: [
//                                         req.params.trackId1,
//                                         req.params.trackId2,
//                                         req.params.trackId3,
//                                     ]});
//                                 newMix.save(
//                                     (err) => {
//                                         if (err) logger.log('magneto-stream', `something went wrong - mix was not saved properly!: ${err}`);
//                                         logger.log('magneto-stream', `new mix: ${newMix} was been saved successfully`);
//                                         ccreateNewMix++;
//                                         logger.log('magneto-stream', `The Api: createNewMix called:${ccreateNewMix}`);
//                                     }
//                                 );
//                             });
//                     });
//             });
//     };
//     exports.dropMix = function (req, res) {
//         MIX.remove({mix_name:{$eq:req.params.mixName}},
//             (err,mix) => {
//                 if (err) logger.log('magneto-stream', `query error: ${err}`);
//                 else console.log(`${mix} was deleted successfully!`);
//                 cdropMix++;
//                 logger.log('magneto-stream', `TThe Api: dropMix called:${cdropMix}`);
//             });
//     };