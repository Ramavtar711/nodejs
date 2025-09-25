

'use strict';
module.exports = function(app) {
  var admin = require('../../controller/admin/authController');
   
   const verifyToken = require('../../middleware/auth');




app.route('/admin/panel').get(admin.showLoginPage);
app.route('/admin/dashboard').get(admin.dashboard);

  // todoList Routes
 app.route('/admin/login').post(admin.login);
app.route('/admin/create').post(admin.create);
app.route('/admin/list').get(admin.list);
app.route('/admin/update').put(admin.update);
app.route('/admin/delete/:id').delete(admin.remove);

   
    };  




