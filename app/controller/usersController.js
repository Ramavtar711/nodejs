
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; 
var UserModel = require('../model/userModel.js');
var db = require('../model/db.js');

const Stripe = require('stripe');
const stripe = Stripe('sk_test_51Kxs06DSrlQCqFnQpKrGTmukiyIpiRDc8xuvVnnodjhzfXUaBW4WKf2QD4MIrdHsrPDGhhZetB6hkGHgamh2nEE600AdJA26VW'); 



exports.signup = async function(req, res) {
  const { name, email, password } = req.body;

  // 1. Basic validation
  if (!email || !password || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // 2. Check if email already exists
  const checkEmailSQL = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailSQL, [email], async function(err, results) {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: "Email already registered" }); // 409 = Conflict
    }

    // 3. If not exists, hash password and insert
    const hashedPassword = await bcrypt.hash(password, 6);
    const insertSQL = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(insertSQL, [name, email, hashedPassword], function(err, result) {
      if (err) {
        return res.status(500).json({ message: "User registration failed", error: err });
      }
      res.json({ message: "User registered successfully" });
    });
  });
};



exports.login = function(req, res) {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async function(err, results) {
    if (err || results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '2h' });
    res.json({ message: "Login successful", token });
  });
};





exports.profile = function(req, res) {
  const userId = req.user.id;

  const sql = "SELECT id, name, email FROM users WHERE id = ?";
  db.query(sql, [userId], function(err, results) {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ profile: results[0] });
  });
};


exports.UpdateProfile = function(req, res) {
  const id = req.params.id;
  const data = req.body;

  UserModel.update_profile(id, data, function(err, result) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json({ message: 'Profile updated successfully', result });
    }
  });
};






exports.create_token = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // or ['upi', 'card', 'paypal'] based on your account
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Test Product',
          },
          unit_amount: 5000, // amount in cents = $50.00
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://yourdomain.com/payment-success',
      cancel_url: 'https://yourdomain.com/payment-cancel',
    });

    // Send the checkout URL to the frontend (or open it in WebView)
    res.status(200).json({
      status: true,
      url: session.url,
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};




exports.getAllUser = function(req,res){
     UserModel.getAllData(function(err, users) {
  if (err) {
      res.send(err);
      return; // stop here if there's an error
    }
    res.send(users);
  });
};


exports.AddUser  = function(req, res) {
  const { name, email, mobile } = req.body;

  UserModel.InsertUsers(name, email, mobile, function(err, insertId) {
    if (err) {
      res.status(500).send({ message: "Insert failed", error: err });
    } else {
      res.send({ message: "User inserted successfully", id: insertId });
    }
  });
};

exports.UserID = function(req,res){
  const {id} = req.body;
  UserModel.UserDetails(id,function(err,result){
       if(err){
        res.send(err);
       }else{
        res.send(result);
       }
  });


};


