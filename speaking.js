'use strict';

module.exports = {
    wrapWithTags: function(text) {
        return `<speak> ${text} </speak>`;
    }
}
