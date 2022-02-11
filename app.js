require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

// hbs.registerPartials(path.join(__dirname, '/views/partials'));


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
	.clientCredentialsGrant()
	.then((data) => spotifyApi.setAccessToken(data.body['access_token']))
	.catch((error) => console.log('Something went wrong when retrieving an access token', error));

app.get('/', (req, res, next) => {
    res.render('index');
});

app.get('/artist-search', (req, res, next) => {
    // console.log(req.query);
   spotifyApi.searchArtists(req.query.artist_name)
        .then((artistsSearchResult) => {
            console.log('The received data from the API: ', artistsSearchResult.body.artists.items[0]);
            const artists = artistsSearchResult.body.artists.items;
            res.render('artist-search-results', {artists});
        })
        .catch(err => console.log('The error while searching artists occured: ', err));
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
