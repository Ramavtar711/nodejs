'use strict';
module.exports = function(app) {
  
   var userList = require('../controller/usersController');

const verifyToken = require('../middleware/auth');


  // todoList Routes
  app.route('/users')
    .get(userList.getAllUser)
    .post(userList.AddUser);
app.route('/signup').post(userList.signup);
app.route('/login').post(userList.login);
app.route('/profile').get(verifyToken,userList.profile);
app.put('/update-profile/:id', userList.UpdateProfile);
app.post('/api/create_token', userList.create_token);

   
      app.route('/users/:id')
     .get(userList.UserID)
   
    };  