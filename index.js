var http = require('http');

var express = require('express');
var app = express();
var nodemailer=require('nodemailer');
var crypto =require('crypto');
var async=require('async');
var bodyParser = require('body-parser');
var cookieParser=require('cookie-parser');
var session = require('express-session');

var flash = require('connect-flash');

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({	

	extended: true
}));
app.use(session({secret: '{session secret key}', 
    cookie: { maxAge: 60000 },
    
    saveUninitialized: true,
    resave: 'true',
    }));
app.use(flash());
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./sqlite-db-file.db');
global.db=db;

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

var fns=require('./functions');
//db.run("CREATE TABLE t3 (id INTEGER PRIMARY KEY AUTOINCREMENT,username TEXT,info  TEXT,filename TEXT)");
 //db.run("CREATE TABLE  t2 (username TEXT PRIMARY KEY,email TEXT,password TEXT,token INTEGER)");
//db.run("CREATE TABLE t5 (fileid INTEGER ,username TEXT,sharedname TEXT,edit boolean)");
//db.run("DROP TABLE t2");
app.get('/', (req, res) => {
	res.render('index', {
		edit:false,
		id:"",
		userid:"",
		filename:"",
		content:""
	});
});
app.get('/editor', (req, res) => {
	res.render('index0', {
		edit:false,
		id:"",
		userid:"",
		filename:"",
		content:""
	});
});
app.get('/forgotpassword',(req,res) => {
	res.render('forgot');
});
app.get('/reset/:token',(req,res) => {
	//aconsole.log(req.cookies['token']);
	if(parseInt(req.params.token)==req.cookies['token'])
	{
	res.render('resetpassword');
}
else
{
	res.send("unauthorized user");
}
});
app.post('/forgot',function(req, res, next) {

	let data=req.body;
	fns.mailcheck('t2',data.email).then(docs=> {
		if(docs.length) {
            res.send("An email is send to " + data.email + " to reset a password."); 
            
            var transporter = nodemailer.createTransport({
            	service:'gmail',
      host:'smtp.gmail.com',
      port:465,
      secure:true,
  auth: {
    user: 'hemanotepadeditor@gmail.com',
    pass: 'zfhs llmz mbof taif'
  },
});
//var token=Math.floor((Math.random() *10000000)+54);
var link="https://notepadeditor1.herokuapp.com/reset/"+data.token;
// document.cookie = "token=" + token;\kl/
//fns.addtoken('t2',token,data.email);
var mailOptions = {
  from: '"Admin-Notepad" <hemanotepadeditor@gmail.com>',
  to: data.email,
  subject: 'Reset Password-Notepad editor',
  html:"Hello,<br> please click the button to verify your email.<br><button><a href="+link+">Click here</a></button>"
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

			
		 }
		  else {
		 	res.end("No account exist for given credentials.");
             }
	 }).catch(err => {
		 
		 res.end("no account exist for given credentials.");
   });
	});
app.get('/loadfiles',(req,res) => {
	 fns.LoadQuery('t3',username,0,20).then(rows => {

	res.render('index1',{
       rows:[]
	});
});
	});
app.get('/savedfiles',(req,res)=>{
	if('cookie' in req.headers)
	{



     var username=req.cookies['username'];
	
	fns.LoadQuery('t3',username, 0,20).then(rows => {
	res.render('index1',{
		rows:rows
	});
   });
}
else
{
 fns.LoadQuery('t3',username,0,20).then(rows => {
		res.render('index1' , {
			rows:[]
		});
	});	
}
});
app.get('/sharedfiles',(req,res) => {
	if('cookie' in req.headers)
	{


	var username=req.cookies['username'];
	//console.log(username);
	fns.share('t3','t5',username).then(result=> {
		res.json(result);
	
	}).catch(err => {
		res.json(err);
	});
}
else
{
 fns.LoadQuery('t3',username,0,20).then(rows => {
		res.render('index1' , {
			rows:[]
		});
	});	
}

});
app.get('/login',(req,res) => {
	res.render('login');

});
app.get('/help',(req,res) => {
	res.render('help');
});
app.get('/signup',(req,res) => {
	res.render('signup');
});

app.get('/edit/:id', (req, res) => {
	fns.find('t3', parseInt(req.params.id)).then(row => {
		res.render('index0', {
			edit: true,
			id: row.id,
			filename: row.filename,
			content: row.info
		});
	});
});
app.get('/:id',(req,res) => {
	
	fns.find('t3',parseInt(req.params.id)).then(row => {
		res.render('index0', {
			edit: true,
			id: row.id,
			filename: row.filename,
			content: row.info
		});
	});
} );
app.get('/view/:filename',(req,res) =>{
	fns.find1('t3',req.params.filename).then(row => {
		res.render('index0', {
		    edit:false,
			id: row.id,
			filename: row.filename,
			content: row.info
		});

	});
});
app.post('/update',(req,res) => {
	let data=req.body;
	fns.update('t3',data.id,data.content).then(result =>{
     res.json(result);
     
     }).catch(err => {
		res.json({
			code: 0,
			message: "Failed to insert."
		});
	});	
});
app.post('/update1',(req,res) => {
	let data=req.body;
	fns.update1('t3',data.content_name,data.content).then(result =>{
     res.json(result);
     
     }).catch(err => {
		res.json({
			code: 0,
			message: "Failed to update."
		});
	});	
});
app.post('/update2',(req,res) => {
	let data=req.body;
	fns.update2('t3',data.content_name,data.content).then(result =>{
     res.json(result);
     
     }).catch(err => {
		res.json({
			code: 0,
			message: "Failed to rename."
		});
	});	
});
app.post('/pwdupdate',(req,res)=> {
	let data=req.body;
	let email=req.cookies['email'];
	fns.update3('t2',email,data.password).then(result =>{
        res.json({
        	code:1
        })
     
     }).catch(err => {
		res.json({
			code: 0,
			message: "Failed to rename."
		});
	});	
});
app.post('/load-more', (req, res) => {
	let data = req.body;

	fns.LoadQuery('t3', data.id, 0,20).then(rows => {
		res.json(rows);
	}).catch(err => {
		res.json({
			message: err
		});
	})
});

app.post('/delete',(req,res) => {
	let data =req.body;
	fns.remove('t3',data.id).then(result => {
		res.json(result);
	}).catch(err => {
		res.json({
			code:0,
			message: "Failed to delete."
		});
	})
});

app.post('/save-content', (req, res) => {
	let data = req.body;

	db.serialize(function() {
         
	     
	     var stmt=db.prepare("INSERT INTO t3 VALUES (?,?,?,?)");
		stmt.run(null,data.username, data.content,data.content_name);
		stmt.finalize();
		
	     	res.end("file saved Successfully!");
	     
	     
	});
});
app.post('/copy', (req, res) => {
	let data = req.body;

	db.serialize(function() {
         
	     
	     var stmt=db.prepare("INSERT INTO t3 VALUES (?,?,?,?)");
		stmt.run(null,data.username, data.content,data.content_name);
		stmt.finalize();
		
	     	res.end("file copied Successfully!");
	     
	     
	});
});
app.post('/share-file',(req,res) => {
let data=req.body;
	db.serialize(function(){
		var stmt=db.prepare(`INSERT INTO t5 VALUES (?,?,?,?)`);
		stmt.run(data.id,data.ownername,data.username,data.edit);
		stmt.finalize();
		res.end("file is shared Successfully!");
	
	});
});
app.post('/auth-login', (req,res) => {
	 let data=req.body;
	 fns.login('t2', data.username, data.password).then(docs => {
		 if(docs.length) {
			
			res.json({
				code: 1,
				message: "login success.",
				username: docs[0].username,
				password: docs[0].password
			});
		 } else {
			 res.json({
				code: 0,
				message: "No account exists with the given credentials."
			});
		 }
	 }).catch(err => {
		 console.log(err);
		 res.json({
			 code: 0,
			 message: "Failed to check login. Something went wrong."
		 });
	 });
});

app.post('/save-userdata',(req,res) => {
	let data=req.body;
	db.serialize(function(err,rows){
		if(!err)
		{
		var stmt=db.prepare(`INSERT INTO t2 VALUES (?,?,?,?)`);
		stmt.run(data.username,data.email,data.password,null);
		stmt.finalize();
		res.end("Created account Successfully!");
	     }
	     else
	     {
	     	res.end("username already exist.")
	     }
	});
});
app.post('/fblogin',(req,res) => {
	let data=req.body;
		var stmt=db.prepare(`INSERT INTO t2 VALUES (?,?,?)`);
		stmt.run(data.username,null,null);
		stmt.finalize();
	
	
	
});

app.get('/search', (req, res) => {
	let key = req.query.q;
	
	var userId = parseInt(req.headers.cookie.split('=')[1]);
	fns.search('d7',userId, key).then(result => {
		res.json(result);
	}).catch(err => {
		res.json(err);
	})
});

const server = http.createServer(app).listen(process.env.PORT || '4000', (err) => {
    if (err) {
		console.log(err);
  	} else {
		const addr = server.address();
		console.log(`Server listening on %s:%s`, addr.address, addr.port);
	}
});



module.exports = app;
