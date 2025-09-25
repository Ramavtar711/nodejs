const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; 
var UserModel = require('../../model/admin/userModel.js');
var db = require('../../model/db.js');
const path = require('path');


exports.showLoginPage = (req, res) => {
      res.sendFile(path.join(__dirname, '../../../public/login.html'));
};

exports.dashboard = (req, res) => {
    res.sendFile(path.join(__dirname, '../../../public/dashboard.html'));
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
 

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if(err || results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: "2h" });
    res.json({ message: "Login successful", token, user: { id: user.id, email: user.email, name: user.name } });
  });
};




// CREATE
exports.create = async (req, res) => {
  const { name, email,password} = req.body;
   const hashedPassword = await bcrypt.hash(password, 6);

  db.query("INSERT INTO users (name, email,password) VALUES (?, ?,?)", [name, email,hashedPassword], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, name, email });
  });
};

// READ
exports.list = (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// UPDATE
exports.update = async(req, res) => {
  const { id, name, email ,password} = req.body;
     const hashedPassword = await bcrypt.hash(password, 6);
  db.query("UPDATE users SET name=?, email=?,password=? WHERE id=?", [name, email,hashedPassword,id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "User updated" });
  });
};

// DELETE
exports.remove = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id=?", [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "User deleted" });
  });
};
