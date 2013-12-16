This is a tutorial to start with NodeJS.
========================================

Sometimes, we are very scared to start using with a new technology. How it work? What i have to do first? What is the right way?

First of all, i need to say it is a tutorial to foment in you a desire to dive in NodeJS and go beyond.

In this tutorial, we will biuld a JSON API to manage User, really basic. We will see also how to set up our ambient, develop and deploy. Start to finish. Cool, right?


Configure your ambient
----------------------

We will work in a Linux VM using Vagrant. Vagrant is the easy way to create and manage VMs.

Go to https://www.virtualbox.org/ download and install Virtual Box following the basic setup.

Now, go to http://www.vagrantup.com/ and download and install Vagrant.

Virtual Box and Vagrant run in Mac, Linux and Windows.

Installed both, clone [this project][1]. Just create a folder called vagrant and run this command:
```
git clone https://github.com/semmypurewal/node-dev-bootstrap.git node-vm
```

You cloned a config file for Vagrant.

If you dont know GIT, i really recommend you give step back, learn GIT and come back here. If you are already scary, this is not the right moment.

> See all documentation about up a Vagrant machine for NodeJS here: https://github.com/semmypurewal/node-dev-bootstrap.


After clone, go to generated folder(node-vm) and run the command `vagrant up`.
Vagrant will automaticly download and install a Ubuntu machine Precise 32.

> vagrant up command read a Vagrantfile file and follow the instructions contained in that(What machine and apps will be used) and after configuration, boot the generated machine.

Done this, our Linux VM are booted and we are able to access it. We will connect to our VM using SSH.

**If you are in Windows:**

If you are using Windows, a recomend you download Putty.

Download and install Putty, open it, put the adress 127.0.0.1 and 2222 port. Click Open.
If asked for credentials, use user vagrant and password vagrant.

You are in your VM now.

**If you are in MAC or Linux:**

If you are using Linux or Mac, open console and type:
vagrant ssh

You are in your VM now.

**Starting NodeJS server**

Lets start NodeJS now and see what happen. In you VM command line type:
```
cd app
node server.js
```

Now access localhost:3000 in your browser. Boom! NodeJS is running in a Ubuntu VM!

**Resuming what happened:**

- You installed a Linux VM, this machine dont have a interface, just command line.
- You booted this machine running vagrant up.
- You accessed this machine via ssh using vagrant ssh.
- You started NodeJS sever running node server.js.

See? Things are happening.


Deploying
---------

Before going, it is necessary you create a account on Heroku. Account created, lets move.

**Installing Heroku**

To deploy our app to heroku is necessary install heroku in your VM. Stop NodeJS in you machine(Ctrl + c) and run the command:

`wget -qO- https://toolbelt.heroku.com/install-ubuntu.sh | sh`

Instalation finished, lets make login at Heroku, this will able you to deploy your app. Just run the command `heroku login` and put your user and password.


**Preparing special Heroku Files**

We need to send two archive to heroku. package.json and Procfile file.

> Heroku will identify your app as NodeJS if find a package.json file. This file contains what npm packages your app need.

> Procfile is a plain text archive that contains the commands necessary to start your app(node app.js command).

Before create this two archives, is important explain one thing. Inside you folder .../vagrant/node-vm exist a folder called app. This folder are shared with your Linux VM. This is like a PHP htdocs folder.

To organize our project inside app folder, lets create a subfolder called my-project. This will be the root folder of your project. .../vagrant/node-vm/app/my-project.

Copy the archive .../vagrant/node-vm/app/serve.js to .../vagrant/node-vm/app/my-project/serve.js

Rename archive serve.js to app.js. This is just to look pretty.

> At the end you will have .../vagrant/node-vm/app/my-project/app.js

Now, at root of your project(.../vagrant/node-vm/app/my-project/) create the archives package.json and Procfile.

In your packge.json, put the code:
```javascript
{
  "name": "herokuex",
  "version": "0.0.1",
  "dependencies": {
    "express": "3.4.x"
  },
  "engines": {
    "node": "0.10.x",
    "npm": "1.2.x"
  }
}
```
> run `npm install express --no-bin-links` to install dependencies

And in Procfile put the code:
```javascript
web: node app.js
```

Lets make some modifications in our app.js(old server.js):
```javascript
// Require Express
var express = require("express");

// Create a new Express app
var app = express();

// Setting logger Express config
app.use(express.logger());

// Setting what happen when someone call '/' url via GET
app.get('/', function(req, res) {
  res.send('Hello World!');
});

// Setting port, auto detect local or online app
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
```

**Deploying**

You can only deploy to Heroku using git. Run the commands bellow to create a git repositore and make your first commit:
```
$ git init
$ git add .
$ git commit -m "init"
```
Good. Now, create a Heroku app running the command:
```
heroku create
```

This command will create a Heroku app and give him a random name. If you want to give him a personal name, run the command passing the name, like this:
```
heroku create my-custom-heroku-app-name
```
![Heroku create](https://lh4.googleusercontent.com/-FmdQer_3V_0/Up27nePwvXI/AAAAAAAACok/W_yJWaIrjho/w993-h689-no/Captura+de+Tela+2013-12-02+a%25CC%2580s+15.56.21.png)

When you create a Heroku app it automatically identify you account becouse you make a heroku login before. If you access your heroku dashboard, you will see yout new app.

Heroku automatically add a remote in your git app. So now, you can make a push, run the command:
```
git push heroku master
```

> Heroku acceppt push only via SSH, if you get some error while push, try run a `heroku keys:add` and try push again

![Heroku Push](https://lh5.googleusercontent.com/-U2sYSiPTiV0/Up27nfVHRtI/AAAAAAAACow/VoFh13qkXjY/w990-h680-no/Captura+de+Tela+2013-12-02+a%25CC%2580s+16.08.29.png)

Your code will send to heroku and a git hook will verify your package.json, install the dependences listed(express) and run your Procfile.

If all runs good, you can access our app now. The url is your-app.herokuapp.com.
If you dont know exactly the name of your created app, access the Heroku dashboard.

Good, you have a deployed NodeJS app.

> You know all the basic flow now. It is time to improve our Node JS app. Lets go!

> Oficial Heroku tutorial: https://devcenter.heroku.com/articles/getting-started-with-nodejs

Building our API
----------------

Our goal now is build an API that supports these features:

| URL       | Method | What                    |
|-----------|--------|-------------------------|
| /user     | POST   | Insert new user         |
| /users    | GET    | Get all users           |
| /user/:id | GET    | Get a single user by ID |
| /user/:id | PUT    | Update user by ID       |
| /user/:id | DELETE | Delete user by ID       |

Open package.json and lets add a new dependence. MongoDB. Just add the following code after Express:
```javascript
"mongoq": "0.2.3"
```

> Run `npm install --no-bin-links` in root folder of your app to install all dependences.

Now, in app.js file, you can require MongoDB:
```javascript
var mongoq = require('mongoq');
```

Before call var app = express();, put out MongoDB connection config:
```javascript
var COLLECTION = 'user_collection';
var DB = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mydb';
var db = mongoq(DB, {safe: false});
var collection = db.collection(COLLECTION);
```

Now, in basic app config, after var app = express();, lets enable new things:
```javascript
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
```

By default, is not possible make Cross Domain request, so lets enable then:
```javascript
// Enabling Cross Domain
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

For now, we just have the hello world:
```javascript
// Basic home route
app.get('/', function (req, res) {
  res.send('Hello World!');
});
```

Now, we will create the following API features:
- Insert new user;
- Get all users;
- Get a user by ID;
- Edit a user;
- Delete a user;


**Insert new user**

```javascript
// POST route to insert new user
app.post('/user', function (req, res) {
  console.log(req);
  collection.insert({name: req.body.name, id: req.body.id}).done(function (result) {
    res.json(result);
  }).fail(function (err) {
      throw err;
    });
});
```

**Get all users**
```javascript
// Get Route to get all user
app.get('/users', function (req, res) {
  collection.find().toArray().done(function (result) {
    res.json(result);
  }).fail(function (err) {
      throw err;
    });
});
```

**Get one user by ID**
```javascript
// GET route to get one user by passed ID
app.get('/user/:id', function (req, res) {
  // Get the passing ID
  var id = req.params.id;
  // Preparing the consult params
  var params = { id: id };
  collection.findOne(params).done(function (result) {
    res.json(result);
  }).fail(function (err) {
      throw err;
    });
});
```

**Editing a user**
```javascript
// PUT route to edit a user by ID
app.put('/user', function (req, res) {
  // Get the passing ID
  var id = req.body.id;
  // Get the new name passed
  var newName = req.body.name;
  // Find by ID and set new name
  collection.update({id: id}, {$set: {name: newName} });
  // Returning
  res.json({ "updated": "true" });
});
```

**Deleting a user**
```javascript
// DELETE route to delete a user by ID
app.del('/user', function (req, res) {
  // Get the passing ID
  var id = req.body.id;
  // Removing
  collection.remove({id: id});
  res.json({ "deleted": "true" });
});
```

Testing API
-----------

First of all, access your machine and start MongoDB server. Run the command:
```
mongod
```

Now, start your Node app:
```
node app.js
```

To test yout API, i recommend you download and install https://addons.mozilla.org/pt-br/firefox/addon/restclient/, this is a plugin thats enable easy request passing JSON.

For GET requests, you can test just accessing in browser:


Publishing
----------

Lets create our Git repository:
```
git init
git add .
git commit -m "init"
```

Create our new Heroku app:
```
heroku create
```
> Copy your automaticly generated app name and URL in this output

Tell Heroku to use MongoLab(Our DB provider):
```
heroku addons:add mongolab
```
![Adding Mongolab to Heroku](https://lh6.googleusercontent.com/-hWot3UCyXPg/Up27nbriJLI/AAAAAAAACos/o9NoYv-UNnI/w990-h682-no/Captura+de+Tela+2013-12-02+a%25CC%2580s+15.57.15.png)

Push all to Heroku:
```
git push heroku master
```

Now you can access you production URL and use your API.

![Inserting a new user](https://lh6.googleusercontent.com/-8pD8PCaxjxA/Up27n7yQQ1I/AAAAAAAACo4/iIcPaHWHkCM/w963-h688-no/Captura+de+Tela+2013-12-02+a%25CC%2580s+16.20.55.png)

![Get users](https://lh6.googleusercontent.com/-qEOje2n8SIU/Up27obnEl9I/AAAAAAAACpI/aLdlWxDMbzg/w446-h293-no/Captura+de+Tela+2013-12-02+a%25CC%2580s+16.22.17.png)

![Heroku dashboard](https://lh6.googleusercontent.com/-4QFErbDMhNU/Up27o8FSORI/AAAAAAAACpU/6JPwzYwzlpk/w791-h397-no/Captura+de+Tela+2013-12-03+a%25CC%2580s+09.01.44.png)


  [1]: https://github.com/semmypurewal/node-dev-bootstrap
