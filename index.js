require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// TASK 2-4
const urlDatabase = {};
let counter = 1;

function isValidURL(urlString) {
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

app.post('/api/shorturl', function(req, res) {
  const originalURL = req.body.url;

  if(isValidURL(originalURL)) {
    const shortURL = counter.toString();
    counter += 1;
    urlDatabase[shortURL] = originalURL;

    res.json({ original_url: originalURL, short_url: shortURL });
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:short_url', (req, res) => {
  const shortURL = req.params.short_url;
  const originalURL = urlDatabase[shortURL];

  if(originalURL) {
    res.redirect(originalURL);
  } else {
    res.json({ error: 'invalid url' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
