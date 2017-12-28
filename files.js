var path = require('path');

exports.SAVE_DIRECTORY = "saved_games";
exports.LOGS_DIRECTORY = "logs";

exports.getCheckpointSaveFile = function(app) {
    return path.resolve(exports.SAVE_DIRECTORY + "/user-" + app.getUser().user_id + "-checkpoint");
}

exports.getUserSaveFile = function(app) {
    return path.resolve(exports.SAVE_DIRECTORY + "/user-" + app.getUser().user_id);
}

exports.getUserInputLogFile = function(app) {
    return path.resolve(exports.LOGS_DIRECTORY + "/user-" + app.getUser().user_id);
}
