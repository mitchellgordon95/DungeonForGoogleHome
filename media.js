exports.sendMap = function(app) {
    app.ask({
        speech: "I've sent a link to a map to your device.",
        displayText: "The map: https://user-images.githubusercontent.com/22687849/33462354-42e538f0-d5f4-11e7-8af9-460ee75c1a0b.png"
    });
}

