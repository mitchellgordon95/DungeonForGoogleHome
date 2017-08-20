module.exports = {
    info: `Dungeon is a game of adventure, danger, and low cunning.  In it you will explore some of the most amazing territory ever seen by mortal man.  Hardened adventurers have run screaming from the terrors contained within.
    In Dungeon, the intrepid explorer delves into the forgotten secrets of a lost labyrinth deep in the bowels of the earth, searching for vast treasures long hidden from prying eyes, treasures guarded by fearsome monsters and diabolical traps!
You are near a large dungeon, which is reputed to contain vast quantities of treasure.   Naturally, you wish to acquire some of it. In order to do so, you must of course remove it from the dungeon.  To receive full credit for it, you must deposit it safely in the trophy case in the living room of the house.
In addition to valuables, the dungeon contains various objects which may or may not be useful in your attempt to get rich.  You may need sources of light, since dungeons are often dark, and weapons, since dungeons often have unfriendly things wandering about.  Reading material is scattered around the dungeon as well;  some of it is rumored to be useful.
To determine how successful you have been, a score is kept. When you find a valuable object and pick it up, you receive a certain number of points, which depends on the difficulty of finding the object.  You receive extra points for transporting the treasure safely to the living room and placing it in the trophy case.  In addition, some particularly interesting rooms have a value associated with visiting them.
Of special note is a thief (always carrying a large bag) who likes to wander around in the dungeon (he has never been seen by the light of day).  He likes to take things.  Since he steals for pleasure rather than profit and is somewhat sadistic, he only takes things which you have seen.  Although he prefers valuables, sometimes in his haste he may take something which is worthless.  From time to time, he examines his take and discards objects which he doesn't like.  He may occasionally stop in a room you are visiting, but more often he just wanders through and rips you off (he is a skilled pickpocket).`,

    main_intent:  'This is Dungeon, a mostly untouched port of the classic 1980\'s text adventure. Some interesting commands are look,<break time="1s" strength="weak"/> checkpoint,<break time="1s" strength="weak"/> restore, <break time="1s" strength="weak"/> and score. To hear the rest of the commands and some other useful things, say <break time="1s" strength="weak"/> help <break time="1s" strength="weak"/> at any time during the game.',

    help_prompt: 'This is the help section. You can hear about game commands, objective of the game, or how to play.',

    commands: {
        'brief': ' suppresses printing of long room descriptions for rooms which have been visited. ',
        'superbrief': ' suppresses printing of long room descriptions for all rooms. ',
        'verbose': ' restores long descriptions. ',
        'quit': ' quits the game for now. ',
        'checkpoint': ' creates a checkpoint to which you can return to by saying restore. ',
        'restore': ' restores your game to the last checkpoint you made. ',
        'restart': ' returns you to the beginning of the game. ',
        'inventory': ' lists the objects in your possession. ',
        'look': ' prints a description of your surroundings. ',
        'score': ' prints your current score and ranking. ',
        'diagnose': ' reports on your injuries, if any. '
    },

    how_to_play: `This is a simple text parser from the 1980's. For reasons of simplicity, all words are distinguished by their first six letters. You are dealing with a fairly stupid parser. That being said, the game understands some complex and random things. For example, you can pick up, take, or put down things. You can look around. You can go north, south, east, west, up, or down. Sometimes you can cross bridges or enter doors. You can do many other things not listed here. Would you like to hear more? You can hear about containment, fighting, or ambiguity.`,

    ambiguity: `Most objects have names and can be referenced by them. Some adjectives are understood and required when there are two objects which can be referenced with the same 'name' (e.g., doors, buttons ). It may be necessary in some cases to include prepositions, but the parser attempts to handle cases which aren't ambiguous without.Thus saying "give car to demon" will work, as will "give demon car" . "give car demon" probably won't do anything interesting. When a preposition is used, it should be appropriate; give car with demon won't parse. The parser tries to be clever about what to do in the case of actions which require objects that are not explicitly specified. If there is only one possible object, the parser will assume that it should be used.  Otherwise, the parser will ask. Most questions asked by the parser can be answered.`,

    containment: `Some objects can contain other objects.  Many such containers can be opened and closed.  The rest are always open.   They may or may not be transparent.  For you to access (e.g., take) an object which is in a container, the container must be open.  For you to see such an object, the container must be either open or transparent.
Containers have a capacity, and objects have sizes; the number of objects which will fit therefore depends on their sizes.  You may put any object you have access to (it need not be in your hands) into any other object.  At some point, the program will attempt to pick it up if you don't already have it, which process may fail if you're carrying too much.  Although containers can contain other containers, the program doesn't access more than one level down.`,

    fighting: `Occupants of the dungeon will, as a rule, fight back when attacked.  In some cases, they may attack even if unprovoked. Useful verbs here are attack <villain> with <weapon>, kill , etc.  Knife-throwing may or may not be useful.  You have a fighting strength which varies with time.  Being in a fight, getting killed, and being injured all lower this strength. Strength is regained with time.  Thus, it is not a good idea to fight someone immediately after being killed.  Other details should become apparent after a few melees or deaths.`
};
