
var sql = require('./db.js');

const User = {};
User.getAllData = function (result) {
        sql.query("Select * from users", function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }
                else{
                  console.log('users : ', res);  

                 result(null, res);
                }
            });   
};





User.InsertUsers = function(name, email, mobile, result) {
  const query = "INSERT INTO users (name, email, mobile) VALUES (?, ?, ?)";
  sql.query(query, [name, email, mobile], function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("Inserted ID: ", res.insertId);
      result(null, res.insertId);
    }
  });
};


User.UserDetails = function(id,result){
  sql.query("SELECT * FROM users WHERE id = ?",id,function(err,res){
if(err){
  result(null,err);
}else{
  result(null,res);
}

  });

};


User.update_profile = function(id, data, result) {
  sql.query("UPDATE users SET ? WHERE id = ?", [data, id], function(err, res) {
    if (err) {
      result(err, null);
    } else {
      result(null, res);
    }
  });
};











module.exports = User;
