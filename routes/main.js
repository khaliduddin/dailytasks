var express = require('express');
var events = require('events');
//var sqlite3 = require('sqlite3');
var dbmanager = require('./dbmanager');
const { title } = require('process');
//var bodyParser = require('body-parser');
//var express = require('bootstrap');
var router = express.Router();
//var app = express();

var db;
var eventEmitter = new events.EventEmitter();
//var db = dbmanager.openconnection();

var dbOpen = function(){
  console.log('connection is about to open 1');
  db = dbmanager.openconnection();
  console.log('connection is about to open 2');
  /*
  if(db==null || db == undefined){
    db = dbmanager.openconnection();
  }
  else{
    console.log('Connection is already open' + db);
    console.log('Connection is already open' + db.length);
  }  
  */
}

var dbClose = function(){  
  console.log('connection is closing...');
  if(db!=null && db != undefined){
    dbmanager.closeconnection(db);
  }
  else{
    console.log('No connection is open');
  }
}

eventEmitter.on('opencn', dbOpen);   
eventEmitter.on('closecn', dbClose);

var alltasks;

async function localf(res){
  console.log('hello1.a');
  console.log(alltasks);
  //let eventcalled = eventEmitter.emit('opencn1');
  //console.log('event result >> ' + eventcalled);
  //await dbOpenCon();
  //let tasks = await dbmanager.get_all_tasks(db);  
  db = dbmanager.openconnection();
  console.log('connection status >> ' + db.state);
  alltasks = await dbmanager.get_all_tasks(db);  
  console.log('all tasks from await in localf');
  //console.log(alltasks);
  //console.log('When open' + db.state);
  alltasks.forEach((row, index) => {
      console.log(row["task_title"] + '\t' + index);
      //alltasks = [row["task_num"], row["task_title"], row["task_type"], row["task_assignedby"], row["task_category"], row["task_created_by"], "Info"];
    });
  eventEmitter.emit('closecn');
  //dbClose();
  console.log('When closed -> ' + db.state);

  res.render('main', { title: 'Express2', alltasks: alltasks });

  //alltasks = tasks;
  //console.log(alltasks);

  //return alltasks;
};

eventEmitter.on('gettasks', localf);

/*
async function dbopening(){
  console.log('connection is about to open 1');
  db = dbmanager.openconnection();
  console.log('connection is about to open 2');
}
*/
//eventEmitter.on('udpatetasklist', localf);

//eventEmitter.emit('gettasks');

//console.log('all tasks');
//console.log(alltasks);

//var values = ['Task#', 'Title', 'Task Type', 'Assigned By', 'Category', 'Current Status', 'Task Info'];

//var values1 = ['Task#', 'Title1', 'Task Type', 'Assigned By', 'Category', 'Current Status', 'Task Info'];
//var values2 = ['Task#', 'Title2', 'Task Type', 'Assigned By', 'Category', 'Current Status', 'Task Info'];

//var allvalues = [values1, values2];

/* GET home page. */
router.get('/', function(req, res, next) {
   /*
  if(alltasks == undefined){
    eventEmitter.emit('gettasks', res);  
  }else{
    //eventEmitter.emit('gettasks', res);
    res.render('main', { title: 'Express', alltasks: alltasks });
  }
  */
  //console.log('hello -> ' + alltasks);
  eventEmitter.emit('gettasks', res);
  //res.render('main', { title: 'Express1', alltasks: localf(res) });
  //console.log('hello2 -> ' + localf(res));
});
/*
router.get('/', function(req, res, next) {
  eventEmitter.emit('gettasks');
  res.render('main', { title: 'Express', alltasks: alltasks });
});
*/
let inputs = [];

router.post('/process_post', function(req, res) {
  console.log('handling form submission');
  //console.log(req.body);
  /*
  console.log(req.body.addtasktitle);
  console.log(req.body.addtasktype);
  console.log(req.body.addtaskstatus);
  console.log(req.body.addassignedby);
  console.log(req.body.addcategory);
  console.log(req.body.adddetails);
*/
  inputs = [
    req.body.addtasktitle,
    req.body.addtasktype,
    req.body.addtaskstatus,
    req.body.addassignedby,
    req.body.addcategory,
    req.body.adddetails,
    "User1"
  ];

  eventEmitter.emit('addnewtask');
  //eventEmitter.emit('udpatetasklist');
  
  //submitnewtask(inputs);
  //res.end();
  //res.render('main', { title: 'Express', alltasks: alltasks });
  res.redirect('/');
});

async function submitnewtask(){
  eventEmitter.emit('opencn');   
  //db = dbmanager.openconnection();
  newid = await dbmanager.add_new_task(db, inputs);  
  console.log(newid);
  eventEmitter.emit('closecn');
  //dbClose();
  console.log('its done');
  inputs = [];    
};

//var eventEmitter = new events.EventEmitter();
//var db = dbmanager.openconnection();

function dbOpenCon(){
  db = dbmanager.openconnection();
}
/*
function dbCloseCon(db){
  dbmanager.closeconnection(db);
}
*/
eventEmitter.on('addnewtask', submitnewtask);

module.exports = router;
//module.exports = app;
