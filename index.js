var express = require('express');
var cors = require('cors');
var app = express();
var words = require('./words');

var allowedOrigins = ['http://localhost:4000',
                      'https://jetholt.com'];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

app.set('port', (process.env.PORT || 4888));

app.get('/', function (req, res) {
    res.send(getRandomWords(words));
})

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});

function getRandomWords(words){
    var wordLength = getRandomIntegerInclusive(5,10);
    var allWords = shuffle(words[wordLength]);
    var allWordsLen = allWords.length;
    var selectedWords = {};
    var goalWord = allWords[getRandomIntegerInclusive(0,allWordsLen)]

    //Initialise the selectedWords array
    for(var i = 0; i < wordLength; i++){
        selectedWords[i] = [];
    }

    //Populate the selectedWords array
    for(var i = 0; i < allWordsLen; i++){
        var word = allWords[i];
        if(word != goalWord){
            var ham = getHammingDistance(word, goalWord);
            if(selectedWords[ham].length < 5){
                selectedWords[ham].push(word);
            }
        }
    }

    //Merge it all down into one array
    var finalWords = [];
    for(var i = 0; i < wordLength; i++){
        finalWords = finalWords.concat(selectedWords[i]);
    }

    //Build our JSON object to transmit
    retObj = {};
    retObj["goal"] = goalWord;
    retObj["length"] = wordLength;
    retObj["words"] = finalWords;
    return retObj;
}

function getRandomIntegerInclusive(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
}


//Code from https://bost.ocks.org/mike/shuffle/
function shuffle(array) {
    var m = array.length, t, i;

    // While there remain elements to shuffle…
    while (m) {

        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);

        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }

    return array;
}

//Strings will all be same length,
//so let's not check for that.
//Aiming for speed, baby!
function getHammingDistance(x, y) {
    var distance = 0;
    var len = x.length;
    for(var i = 0; i < len; i++){
        x.charAt(i) == y.charAt(i) ? distance++ : distance;
    }
    return distance;
};
