#!/bin/bash
# Checks the health of the dungeon service on this machine. Attempts to bring it back if dead.
# You probably want to run this to crontab or something

### IMPORTANT ####
# Assumes the script is in the same directory as the service script. DO NOT MOVE IT.
# Assumes script has root access. Must run as sudo.

curl https://dungeon.mitchgordon.me/health -ksSf > /dev/null
if [[ $? != 0 ]]; then
    echo "Sites down"
    echo "dungeon.mitchgordon.me" | mail -s "Site down. Trying to bring it back up." mitchell.gordon95@gmail.com
    cd "${BASH_SOURCE[0]}"
    echo "Trying to bring it back up"
    nohup node index.js &
fi
