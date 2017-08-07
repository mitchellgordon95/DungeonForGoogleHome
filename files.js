'use strict';
var path = require('path');

const SAVE_DIRECTORY = "saved_games";

module.exports = {
    SAVE_DIRECTORY: SAVE_DIRECTORY,
    getCheckpointSaveFile: function(app) {
        return path.resolve(SAVE_DIRECTORY + "/user-" + app.getUser().user_id + "-checkpoint");
    },
    getUserSaveFile: function(app) {
        return path.resolve(SAVE_DIRECTORY + "/user-" + app.getUser().user_id);
    }
};
