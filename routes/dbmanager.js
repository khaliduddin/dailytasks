//var express = require('express');
var sqlite3 = require('sqlite3').verbose();
//var router = express.Router();

// open database from file
exports.openconnection = function () {
  return new sqlite3.Database('./db/training.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('connection error -> ' + err.message);
    }
    console.log('Connected to the TRAINING database.');
  });
};

//querying data from the table
exports.get_all_tasks = function(db){
  console.log(db);
  let sql = 'select * from nodejs_tasks where task_is_removed = 0';
  return new Promise((resolve, reject) => {
          db.all(sql, [], (err, rows) => {
            //console.log('rows:::' + rows);
            if(err){
              console.log('error in get_all_tasks');
              console.error(err.message);
              reject(err);
            }else{
              resolve(rows);
            }            
          }); 
        });
}

exports.add_new_task = function(db, taskInput){

  let qry = `INSERT INTO nodejs_tasks(
    task_num, task_title, task_type, task_status, task_assignedby, task_category, task_details
    , task_created_on, task_created_by
    ) 
    VALUES
    (
    (select max(task_num)+1 from nodejs_tasks)
    , ?, ?, ?, ?, ?, ?
    , datetime('now', 'localtime'), ?
    )`;
  console.log(taskInput);
  console.log(db);
  return new Promise((resolve, reject) => {
    db.run(qry, taskInput, (err, nextId) => {
      //console.log('rows:::' + rows);
      if(err){
        console.log('error in add_new_task');
        console.error(err.message);
        reject(err);
      }else{
        // get the last insert id
        console.log(qry);
        console.log(`A row has been inserted with rowid ${this.nextId}`);
        resolve(nextId);
      }            
    }); 
  });  
}

/*
db.serialize(() => {
  db.each(`SELECT id,
                  title,
                  describe
           FROM demo1`, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    console.log(row.id + "\t" + row.title + "\t" + row.describe);
  });
});
*/

// close the database connection
exports.closeconnection = function(db){
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Close the database connection.');
  });
};

//module.exports = router;
