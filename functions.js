require("dotenv").config();
var fs = require("fs");
var keys = require("./keys.js");
var request = require('request');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
module.exports = {

    bandsInTown: function (parameter) {
        // queries bandsintown api with given band name
        var queryUrl = "https://rest.bandsintown.com/artists/" + parameter + "/events?app_id=codingbootcamp";
        request(queryUrl, function (error, response, body) {
            var JS = JSON.parse(body);
            for (i = 0; i < JS.length; i++) {
                var dTime = JS[i].datetime;
                var month = dTime.substring(5, 7);
                var year = dTime.substring(0, 4);
                var day = dTime.substring(8, 10);
                var dateForm = month + "/" + day + "/" + year
                //log outupt
                MyLog("Name: " + JS[i].venue.name);
                MyLog("City: " + JS[i].venue.city);
                MyLog("Date: " + dateForm);
                MyLog("\n---------------------------------------------------\n");
            }
        });
    },
    //node liri.js spotify-this-song [song name]
    getMeSpotify: function (parameter) {
        // queries spotify api with given song name, if no song name is given then the default track is Blink 182
        if (!parameter) {
            parameter = "What's my age again";
        }
        spotify.search({ type: 'track', query: parameter }, function (err, data) {

            output =
                "Artist Name: " + data.tracks.items[0].album.artists[0].name + "\n" +
                "Song Name: " + "'" + parameter.toUpperCase() + "'" + "\n" +
                "URL: " + data.tracks.items[0].album.external_urls.spotify + "\n" +
                "Album Name: " + data.tracks.items[0].album.name +
                "\n---------------------------------------------------\n";
            MyLog(output);
        });
    },
    //node liri.js movie-this [movie name]
    movieInfo: function (parameter) {
        //if user doesnt enter in a movie, then the default is set
        var findMovie;
        if (parameter === undefined) {
            findMovie = "Mr. Nobody";
        } else {
            findMovie = parameter;
        };
        //querey omdb api to find movie
        var queryUrl = "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=8ecac5ba";

        request(queryUrl, function (err, res, body) {
            // console.log(body);
            var Movie = JSON.parse(body);
            MyLog("\n---------------------------------------------------\n");
            MyLog("Title: " + Movie.Title);
            MyLog("Year: " + Movie.Year);
            MyLog("IMDB Rating: " + Movie.imdbRating);
            MyLog("Rotten Tomatoes Rating: " + Movie.Ratings[1].Value);
            MyLog("Country: " + Movie.Country);
            MyLog("Language: " + Movie.Language);
            MyLog("Plot: " + Movie.Plot);
            MyLog("Actors: " + Movie.Actors);
            MyLog("\n---------------------------------------------------\n");
        });
    },
    //node liri.js do-what-it-says
    getRandom: function () {
        fs.readFile('random.txt', "utf8", function (error, data) {

            if (error) {
                return MyLog(error);
            }

            var dataArr = data.split(",");

            if (dataArr[0] === "spotify-this-song") {
                var songcheck = dataArr[1].trim().slice(1, -1);
                module.exports.getMeSpotify(songcheck);
            }
            else if (dataArr[0] === "concert-this") {
                if (dataArr[1].charAt(1) === "'") {
                    var dLength = dataArr[1].length - 1;
                    var data = dataArr[1].substring(2, dLength);
                    console.log(data);
                    module.exports.bandsInTown(data);
                }
                else {
                    var bandName = dataArr[1].trim();
                    console.log(bandName);
                    module.exports.bandsInTown(bandName);
                }

            }
            else if (dataArr[0] === "movie-this") {
                var movie_name = dataArr[1].trim().slice(1, -1);
                movieInfo(movie_name);
            }

        });

    }
}
function MyLog(data) {
    console.log(data);

    fs.appendFile("log.txt", (data + '\n'), function (err) {
        if (err) {
            return console.log(err);
        }
    });
}