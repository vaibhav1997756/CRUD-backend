const express = require("express");
const cors = require("cors");
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies in requests

const port = 8080;

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud",
    port:3307
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as ID ' + db.threadId);
});

// Get all records from `usercrud`
app.get("/", (req, res) => {
    const sql = "SELECT * FROM usercrud";
    db.query(sql, (err, data) => {
        if (err) {
            console.error('Error fetching data: ', err);
            return res.status(500).json({ error: "Failed to fetch data" });
        }
        return res.json(data);
    });
});

// Create a new record in `usercrud`
app.post('/create', (req, res) => {
    const sql = "INSERT INTO usercrud (`name`, `email`,`phone`,created_at) VALUES (?, ?,?,NOW())";
    const values = [
       
        req.body.name,
        req.body.email,
        req.body.phone
    ];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error('Error inserting data: ', err);
            return res.status(500).json({ error: "Failed to insert data" });
        }
        return res.json({ message: "Data inserted successfully", data });
    });
});


app.put('/update/:id', (req, res) => {
    const sql = "UPDATE usercrud SET `name`=?,`email`=? ,`phone`=?,`updated_at`=NOW() WHERE id=? ";
    const values = [
        req.body.name,
        req.body.email,
        req.body.phone
    ];

    const id=req.params.id;

    db.query(sql, [...values ,id], (err, data) => {
        if (err) {
            console.error('Error inserting data: ', err);
            return res.status(500).json({ error: "Failed to insert data" });
        }
        return res.json({ message: "Data inserted successfully", data });
    });
});


app.delete('/usercrud/:id', (req, res) => {
    const sql = "DELETE FROM usercrud WHERE ID = ? ";
    const id=req.params.id;

    db.query(sql, [id], (err, data) => {
        if (err) {
            console.error('Error inserting data: ', err);
            return res.status(500).json({ error: "Failed to insert data" });
        }
        return res.json({ message: "Data inserted successfully", data });
    });
});


app.get('/read/:id', (req, res) => {
    const sql = "SELECT * FROM usercrud";
    const id=req.params.id;

    db.query(sql,[id], (err, data) => {
        if (err) {
            console.error('Error fetching data: ', err);
            return res.status(500).json({ error: "Failed to fetch data" });
        }
        return res.json(data);
    });
});


// Start the server
app.listen(port, () => {
    console.log("Server running on port 8080");
});






