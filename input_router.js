var files = require('./files.js');
var strings = require('./strings.js');
var dialogue_tree = require('./dialogue_tree.js');
var zork = require('./zork.js');
var reading = require('./reading.js');
var fs = require('fs');
var list_keys = require('./utils.js').list_keys;

const RETURN_TO_GAME_KEY = 'return_to_game';
const BACK_KEY = 'back';
const PATH_KEY = 'path';
const CURRENT_PAGE_KEY = reading.CURRENT_PAGE_KEY;
const PAGES_KEY = reading.PAGES_KEY;

// Accepts an incoming main intent.
exports.acceptMain = function (app) {
    fs.access(files.getUserSaveFile(app), fs.constants.R_OK, (err) => {
        if (err) {
            app.askSSML(strings.main_intent);
        } else {
            zork.doReturningUserLook(app);
        }
    });
}

// Accepts a text input intent.
exports.acceptInput = function(app) {
    var input = app.getRawInput();
    var dialogue_state = app.getDialogState();

    // If we have state, that means we asked them to select an option but they
    // didn't say anything we understood
    if (PATH_KEY in dialogue_state && dialogue_state[PATH_KEY].length > 0) {
        var prompt = `Sorry, I didn't understand that. I thought you said "${input}".`;

        if (CURRENT_PAGE_KEY in dialogue_state) {
            prompt = `${prompt} Would you like to keep reading?`;
            app.askWithListSSML(prompt, reading.makePagesOptions(app), dialogue_state);
        } else {
            var current_node = followPath(dialogue_state[PATH_KEY]);
            prompt = `${prompt} The options are ${list_keys(current_node.children)}. You can also return to the game.`;
            app.askWithListSSML(prompt, buildList(app, current_node), dialogue_state);
        }
    }

    var next_node = dialogue_tree.getChildWithKeyOrAlias(input);
    if (next_node) {
        doNode(app, next_node, [next_node.key]);
    } else {
        zork.handleInput(app);
    }
}

// Accepts an incoming option selection intent.
// If we're here, we're assuming that we're somewhere within the dialogue
// tree that is not the root.
exports.acceptOption = function(app) {
    var dialogue_state = app.getDialogState();
    var selected_option = app.getSelectedOption();

    var current_node = followPath(dialogue_state[PATH_KEY]);

    // Reading pages always takes priority
    if (CURRENT_PAGE_KEY in dialogue_state && selected_option != reading.QUIT_READING_KEY) {
        var next_page_index = dialogue_state[CURRENT_PAGE_KEY] + 1;
        var pages = dialogue_state[PAGES_KEY];
        if(pages.length - 1 === next_page_index) {
            var [parent, parent_path] = backtrack(dialogue_state[PATH_KEY]);
            var next_page = pages[next_page_index];
            doNode(app, parent, parent_path, next_page);
            return;
        } else {
            dialogue_state[CURRENT_PAGE_KEY] = next_page_index;
            app.askWithListSSML(pages[next_page_index], reading.makePagesOptions(app), dialogue_state);
            return;
        }
    } else if (CURRENT_PAGE_KEY in dialogue_state){
        // We're quitting reading
        var [parent, parent_path] = backtrack(dialogue_state[PATH_KEY]);
        doNode(app, parent, parent_path, 'Ok.');
        return;
    }

    if (selected_option == RETURN_TO_GAME_KEY) {
        app.askSSML('Ok, returning to game. What do you do next?');
        return;
    }

    next_node = current_node.getChildByKey(selected_option);
    if (next_node) {
        doNode(app, next_node, dialogue_state[PATH_KEY].concat(selected_option));
        return;
    }

    var prompt = `Sorry, something went wrong. Returning to game.`;
    app.askSSML(prompt);
}

// param path: the path of the node we're doing
function doNode(app, node, path=[], say_first) {
    if (node === dialogue_tree) {
        if (say_first) {
            app.askSSML(`${say_first} What do you do next?`);
        }

        return;
    }

    var dialogue_state = {[PATH_KEY]: path};
    if (node.terminatingAction) {
        node.terminatingAction(app);
    } else if (node.hasChildren()) {
        if (say_first) {
            var text = `${say_first} Would you like to hear about something else? The options are ${list_keys(node.children)}`;
            app.askWithListSSML(text, buildList(app, node), dialogue_state);
        } else{
            app.askWithListSSML(node.text, buildList(app, node), dialogue_state);
        }
    } else {
        var pages = reading.makePages(node.text);
        if (pages.length === 1) {
            // If this is a leaf node, we're going to say it's text and then return to the parent
            var [parent, parent_path] = backtrack(dialogue_state[PATH_KEY]);
            doNode(app, parent, parent_path, pages[0]);
        } else {
            dialogue_state[CURRENT_PAGE_KEY] = 0;
            dialogue_state[PAGES_KEY] = pages;
            app.askWithListSSML(pages[0], reading.makePagesOptions(app), dialogue_state);
        }
    }
}

// Given a node, build a list to select one of its children
function buildList(app, node) {
    var list = app.buildList();
    for (var key in node.children) {
        list.addItems(
            app.buildOptionItem(key, node.children[key].aliases.concat(key)).setTitle(key)
        );
    }
    list.addItems(app.buildOptionItem(RETURN_TO_GAME_KEY, ['return to game', 'return', 'game', 'no', 'quit', 'leave', 'none', 'stop']).setTitle('Return to Game'));
    return list;
}

function backtrack(path) {
    if (path) {
        new_path = path.slice(0, -1);
        return [followPath(new_path), new_path];
    } else {
        return [dialogue_tree, []];
    }
}

function followPath(path) {
    var node = dialogue_tree;
    if (path) {
        for (var key of path) {
            node = node.getChildByKey(key);
        }
    }
    return node;
}
