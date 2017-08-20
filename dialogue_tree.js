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
    .registerChildWithText('tutorial', strings.main_intent)
    .registerChildWithAction('checkpoint', saves.checkpoint);

root.getChildByKey('help')
    .registerChildWithText('objective', strings.info, ['game objective', 'objective of game', 'objective of the game'])
    .registerChildWithText('commands', `The commands are ${list_keys(strings.commands)}. Say a command to hear more about it or say return to return to the game.`, ['game commands'])
// TODO
    .registerChildWithText('how to play', strings.how_to_play, ['play', 'how', 'how to']);

for (var command in strings.commands) {
    root.getChildByKey('help')
        .getChildByKey('commands')
        .registerChildWithText(command, strings.commands[command]);
}

root.getChildByKey('help')
    .getChildByKey('how to play')
    .registerChildWithText('ambiguity', strings.ambiguity)
    .registerChildWithText('fighting', strings.fighting)
    .registerChildWithText('command parser', strings.command_parser);
