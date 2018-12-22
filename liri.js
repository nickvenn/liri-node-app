var search = require("./functions");
// gets function call along with parameter
var action = process.argv[2];
var parameter = process.argv.slice(3).join(' ');


switchCase();

function switchCase() {
    // case switch on the users input to see which api to call 
    // and sends in users parameter to that function
    switch (action) {

        case 'concert-this':
            search.bandsInTown(parameter);
            break;

        case 'spotify-this-song':
            search.getMeSpotify(parameter);
            break;

        case 'movie-this':
            search.movieInfo(parameter);
            break;

        case 'do-what-it-says':
            search.getRandom();
            break;

        default:
            console.log("Invalid Instruction");
            break;
    }
};