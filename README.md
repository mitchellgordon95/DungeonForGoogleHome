# Ok google, let me talk to Dungeon RPG
should work with any google assistant enabled device.

## What is this?
It's [Zork](https://en.wikipedia.org/wiki/Zork), but on Google Assistant. Zork is "one of the earliest interactive fiction computer games," beloved by many. It's a treasure-hunting, troll-fighting text-adventure that you control using natural language. The natural language is parsed by a sometimes dubious NLP system developed by some MIT guys in the 80s. 

I believe this particular version is called Dungeon, which is what Zork was before Infocom got it and transformed it into Zork I, II, and III. Someone with more knowledge please correct me if I'm wrong.

## How does it work?
Poorly, probably. We'll see. Here's what we've done:

First, we  (and by we I mean me) modified the original zork executable (using open source code kindly provided by Infocom and [posted by devshane](https://github.com/devshane/zork)) to be a command line utility, which accepts a save file name and a user command. The utility, when invoked, loads the save file, does the command, outputs some game text to stdout, and then overwrites the save file with the new state.

We then wrapped the zork utility in nodejs, which passes input from the Google Home (or other assisstant-enabled devices) to the zork utility, along with a save file name determined by your user id. It then relays the output of the zork utility back to the Google Home.

Finally, we added some things to make zork more usable over voice. We redid the "help" command to have navigatable sections. We made sure that no output from the app ever exceeded 120 seconds, which is the limit imposed by Google Home. We made sure every output from the app ended with a user prompt, and not just a statement, etc.

Most of these things were done because the app was rejected by Google Home. See below for reasons the app was rejected.

## Can I contribute?

Absolutely. Please do. There's plenty of issues and improvements that need to be made in the Github issue tracker. 

Ping me at mitchell.gordon95@gmail.com and I can get you set up with dev access to the app. The app just got approved, so I still haven't figured out how to *not* test in prod, but I will soon.

## Reasons Dungeon was rejected

v1:
Must have prompts for user input at the end of all output. Service went down during testing.

v2:
Some dungeon output is longer than 120 seconds (that's the max).

v3:
"Restart" is not implemented. "Please make sure that a user can complete all core conversational flows listed in your registration information or *recommended by your app*."

v4:
Paging zork output caused the app to crash.
The reviewer attempted to get the app to "move to the house", "look in the mailbox", "turn around", to which the app would respond "I don't understand that. I thought you said, "what is in the mailbox". Returning to game. What do you do next?".

v5: Passed.
