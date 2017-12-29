var DialogueNode = require('./dialogue_tree_node.js');
var strings = require('./strings.js');
var list_keys = require('./utils.js').list_keys;
var saves = require('./saves.js');

var root = module.exports = new DialogueNode('root')
    // Note: these commands must be available from the root node, or else they won't override
    // the corresponding zork commands ( which don't play nice with the google actions ux )
    .registerChildWithText('info', strings.info)
    .registerChildWithText('help', strings.help_prompt)
    .registerChildWithAction('save', saves.checkpoint)
    .registerChildWithAction('quit', (app) => app.tell('Goodbye!'))
    .registerChildWithAction('restore', saves.restore)
    // end note.
    .registerChildWithText('restart', 'Are you sure you want to restart? This will return you to the beginning of the game, but it will not erase your checkpoint. Say yes or no.')
    .registerChildWithText('tutorial', strings.main_intent)
    .registerChildWithAction('checkpoint', saves.checkpoint);

root.getChildByKey('restart')
    .registerChildWithAction('no', (app) => app.askSSML('Okay, returning to game. What do you do next?'))
    .registerChildWithAction('yes', saves.restart);

root.getChildByKey('help')
    .registerChildWithText('how to play', strings.how_to_play, ['play', 'how', 'how to'])
    .registerChildWithText('objective', strings.info, ['game objective', 'objective of game', 'objective of the game'])
    .registerChildWithText('commands', `The commands are ${list_keys(strings.commands)}. Say a command to hear more about it or say return to return to the game.`, ['other commands']);

for (var command in strings.commands) {
    root.getChildByKey('help')
        .getChildByKey('commands')
        .registerChildWithText(command, strings.commands[command]);
}

root.getChildByKey('help')
    .getChildByKey('how to play')
    .registerChildWithText('ambiguity', strings.ambiguity)
    .registerChildWithText('fighting', strings.fighting)
    .registerChildWithText('containment', strings.containment);
