var express = require('express')
var app = express()
const upload = require('express-fileupload');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
const IP = '100.115.92.206';
app.use(upload())
const path = require('path')
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://taurusMonkey:ariesM0nkey@ds363118.mlab.com:63118/attracthezodiac';



app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/signUp', (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      var dbo = db.db("attracthezodiac");
     
          dbo.collection("people").insertOne({
              username:req.body.username,
              birthday:req.body.birthday,
              password:req.body.password,
              tropical:req.body.tropical,
              chinese:req.body.chinese,
              element:req.body.element
          });
     
      res.redirect('/')
    });
});

app.post('/logIn', (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
      if (err) throw err;
      const dbo = db.db("attracthezodiac");
      dbo.collection("people").find({"username":`${req.body.username}`}).toArray((err, data) => {
    
              if (req.body.password === data[0].password) {
                  res.render('landing', {data:data});
              } else {
                  res.redirect('/');
              }
  
      }); 
  });
});

app.get('/landing', (req, res) => {
  res.render('home');
})

app.get('/info', (req, res) => {
  res.render('info');
});

app.get('/search', (req, res) => {
  res.render('search');
});

app.get('/editProfile', (req, res) => {
  res.render('editProfile');
});

app.get('/searching', (req, res) => {

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("attracthezodiac");

    dbo.collection("people").find({$and:[{'tropical':`${req.query.tropical}`}, {'chinese':`${req.query.chinese}`}]}).toArray((err, data) => {
        if (err) throw err;
  
        res.render('searching', {data});
    });

  });

  // MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
  //     if (err) throw err;
  //     var dbo = db.db("attracthezodiac");

  //     dbo.collection("people").find({$and:[{'tropical':`${req.query.tropical}`}, {'chinese':`${req.query.chinese}`}]}).toArray((err, data) => {
  //         if (err) throw err;
  //         const bufy = Buffer.from(data[0].pictureData);
  //         const stringy = bufy.toString('base64');
  //         data[0].pictureData = stringy;
  //       console.log(data[0].pictureData)
  //         res.render('searching', {data:data})
  //     });

  // });
});

app.post('/uploadPic', (req, res) => {
  const bufy = Buffer.from(req.files.pic.data);
  const stringy = bufy.toString('base64');
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("attracthezodiac");
    
    dbo.collection('people').updateOne({'username':`${req.cookies.username}`}, 
    {$set: {'pictureData':`${stringy}`}}, 
    (err, r) => {
      res.render('editProfile');
    });
  });
});

app.post('/uploadSpiel', (req, res) => {

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("attracthezodiac");
    
    dbo.collection('people').updateOne({'username':`${req.cookies.username}`}, 
    {$set: {'spiel':`${req.body.spiel}`}}, 
    (err, r) => {
      res.render('editProfile');
    });
  });
});

app.post('/uploadBio', (req, res) => {

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("attracthezodiac");
    dbo.collection('people').updateOne({'username':`${req.cookies.username}`}, 
    {$set: {'bio':`${req.body.bio}`}}, 
    (err, r) => {
      res.render('editProfile');
    });
  });
});

app.post('/uploadQuestions', (req, res) => {

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("attracthezodiac");
    
    dbo.collection('people').updateOne({'username':`${req.cookies.username}`}, 
    {$set: {
      'likes':`${req.body.likes}`,
      'dislikes':`${req.body.dislikes}`,
      'loves':`${req.body.loves}`,
      'hates':`${req.body.hates}`,
      'guiltyPleasures':`${req.body.guiltyPleasures}`,
      'music':`${req.body.music}`,
      'fun':`${req.body.fun}`,
      'work':`${req.body.work}`,
      'movies':`${req.body.movies}`,
      'sex':`${req.body.sex}`,
      'drugsAlcohol':`${req.body.drugsAlcohol}`,
      'tobacco':`${req.body.tobacco}`,
      'food':`${req.body.food}`,
      'respects':`${req.body.respects}`,
      'comedy':`${req.body.comedy}`,
      'art':`${req.body.art}`,
    }}, 
    (err, r) => {
      res.render('editProfile');
    });
  });
});



app.get('/profile', (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("attracthezodiac");
    dbo.collection("people").find({'username':`${req.cookies.search}`}).toArray((err, data) => {
        if (err) throw err;
        res.render('profile', {data});
    });
  });
});

app.post('/message', (req, res) => {

  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("attracthezodiac");
      dbo.collection("messages").insertOne({
        sender:req.cookies.username,
        receiver:req.cookies.search,
        message:req.body.message,
      });
      res.render('messages')
  });
});

app.get('/messages', (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
    var dbo = db.db("attracthezodiac");
    dbo.collection("messages").find({'sender':`${req.cookies.username}`}).toArray((err, data) => {
        if (err) throw err;
        res.render('messages', {data});
    });
  });
});

app.get('/getMessages', (req, res) => {
//req.cookies.messagesFrom
 MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) throw err;
	    var dbo = db.db("attracthezodiac");
	    dbo.collection("messages").find({
		'$or':[
			{$and:[{'sender':`${req.cookies.messagesFrom}`}, {'receiver':`${req.cookies.username}`}]},
			{$and:[{'sender':`${req.cookies.username}`}, {'receiver':`${req.cookies.messagesFrom}`}]},

		    ]}).toArray((err, data) => {

		if (err) throw err;
		res.render('readMessages', {data});
    });
  });

});





app.get('/zenofone', (req, res) => {
  res.render('zenofone')
});

app.listen(8080, IP, console.log(`${IP}:8080`))
