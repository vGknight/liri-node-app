var auth = require("./keys.js");
var TwitterRequest = require('twitter');
var spotifyQuery = require('node-spotify-api');
var request = require('request');
var fs = require('fs');
var command = process.argv[2];
var options = process.argv[3];


function initApp() {
    switch (command) {
        case "my-tweets":
            getTweets();
            break;
        case "spotify-this-song":
            getSpotifyQuery();
            break;
        case "movie-this":
            getMovie();
            break;
        case "do-what-it-says":
            txtFile();
            break;
        default:
            console.log("Please use one of the commands: spotify-this-song 'song title', movie-this 'movie title', and do-what-it-says.")
    };
};

function getTweets() {
    params = { screen_name: 'gk19680681' };
    client = new TwitterRequest(auth.twitterAuth);
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            var max = 20;
            for (i = 0; i < tweets.length; i++) {
                console.log(tweets[i].text);
                if (i > max) {
                    break;
                }
            }
        } else if (error) {
            console.log(error);
        }
    });
}


function getSpotifyQuery() {

    if (options === undefined) {
        options = "Enter The Wu-Tang Clan - 36 Chambers (Deluxe Version)";
        console.log(options);
    };

    var spotify = new spotifyQuery(auth.spotifyAuth);
    spotify.search({ type: 'track', query: options }, function(err, data) {

        if (err) {
            console.log('Error occurred: ' + err);
            return;
        } else {

            console.log("How about these?");
            console.log("");
            for (var i = 0; i < data.tracks.items.length; i++) {
                console.log("Song: " + data.tracks.items[i].name);
                console.log("Artist: " + data.tracks.items[i].artists[0].name);
                console.log("Album: " + data.tracks.items[i].album.name);
                console.log("Link: " + data.tracks.items[i].href);
                console.log("");
                // var songInfo = {
                //     song: data.tracks.items[i].name,
                //     artist: data.tracks.items[i].artists[0].name,
                //     album: data.tracks.items[i].album.name,
                //     link: data.tracks.items[i].href
                // };
            };
        };
    });
};

function getMovie() {

    if (options === undefined) {
        options = "Mr. Nobody";
    };
    request('http://www.omdbapi.com/?apikey=40e9cece&t=' + options + '&y=&plot=short&r=json&tomatoes=true', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            console.log("Title: " + body.Title);
            console.log("Year: " + body.Year);
            console.log("imdb Rating: " + body.imdbRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
            console.log("RottenTomatoes Rating: " + body.tomatoRating);
            console.log("RottenTomatoes Link: " + body.tomatoURL);
            console.log("");

            // do something with this later ie:logging
            // var movieInfo = {
            //     title: body.Title,
            //     year: body.Year,
            //     imdbRating: body.imdbRating,
            //     country: body.Country,
            //     language: body.Language,
            //     plot: body.Plot,
            //     actors: body.Actors,
            //     rottentomatoesrating: body.tomatoRating,
            //     rottentomatoeslink: body.tomatoURL

            // };
        };
    });
};

function txtFile() {
    fs.readFile("./random.txt", "utf8", function(err, data) {
        if (err) {
            throw err;
        } else if (!err) {
            dataSplit = data.split(",");
            command = dataSplit[0];
            options = dataSplit[1];
            initApp();
        };
    });
};

initApp();