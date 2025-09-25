const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3000;

// MySQL connection
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs'
});

mc.connect(err => {
    if(err) throw err;
    console.log("DB connected!");
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// ✅ API Routes
const approutes = require('./app/routes/approutes');
const userroutes = require('./app/routes/userroutes');
// admin route

const authroutes = require('././app/routes/admin/auth');

approutes(app);
userroutes(app);
authroutes(app);

// ✅ Static files (after API routes)
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(port, () => {
    console.log('Server started on port ' + port);
});
