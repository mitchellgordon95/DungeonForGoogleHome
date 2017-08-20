var path = require('path');

exports.SAVE_DIRECTORY = "saved_games";

exports.getCheckpointSaveFile = function(app) {
    return path.resolve(exports.SAVE_DIRECTORY + "/user-" + app.getUser().user_id + "-checkpoint");
}

exports.getUserSaveFile = function(app) {
    return path.resolve(exports.SAVE_DIRECTORY + "/user-" + app.getUser().user_id);
}
