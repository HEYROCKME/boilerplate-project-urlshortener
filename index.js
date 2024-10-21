require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const dns = require('dns')
// Basic Configuration
const port = process.env.PORT || 3000;

// Faux DB
const urlsArr = []

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// GET redirect by short code
app.get('/api/shorturl/:short',(req, res)=>{
  if (urlsArr.length == 0) {
    return res.json({error : "Not Found"})
  }
  let shortUrl = urlsArr.find((that) => { return that.short_url == req.params.short })
  res.redirect(shortUrl.original_url)
  
})
// POST a new url to the service
app.post( '/api/shorturl/',(req, res) => {
  // POST request with string or "number" short url
  res.setHeader('Content-Type', 'text/plain')
  let url = req.body.url.toLowerCase()
  let urlObj = {original_url: url, short_url: urlsArr.length +1}
  
  dns.lookup(new URL(url).hostname, null, (err, address, family)=> {
    if (err) { 
      // console.log(err, address, family)
      res.json({error: "invalid url"})
    } else {
      
      urlsArr.push(urlObj) // DEV to faux DB
      res.json({...urlObj})
      // console.log("Added:", urlObj)
    }
  })

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
