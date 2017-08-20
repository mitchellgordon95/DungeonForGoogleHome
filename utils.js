'use strict';

exports.list_keys = function(sections) {
    return Object.keys(sections).reduce(function(acc, val, idx) {
        if (idx == Object.keys(sections).length - 1) {
            return `${acc}, <break time='1000ms' strength='weak'/>and ${val}.`;
        } else {
            return `${acc}, <break time='1000ms'strength='weak'/>${val}`;
        }
    });
}
