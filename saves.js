var spawn = require('child_process').spawn;
var files = require('./files.js');

exports.checkpoint = function(app) {
    var checkpoint_save_file = files.getCheckpointSaveFile(app);
    var user_save_file = files.getUserSaveFile(app);

    spawn('cp', [user_save_file, checkpoint_save_file]);
    // TODO - error handling
    // TODO - confirm.
    app.askSSML("Overwrote your last checkpoint with current game. What do you do next?");
};

exports.restore = function(app) {
    var checkpoint_save_file = files.getCheckpointSaveFile(app);
    var user_save_file = files.getUserSaveFile(app);

    // TODO - check has checkpoint
    spawn('cp', [checkpoint_save_file, user_save_file]);
    // TODO - error handling
    // TODO - confirm.
    app.askSSML("Restored game to last checkpoint. What do you do next?");
};
