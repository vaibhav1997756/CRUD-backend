// const express= require("express");
// const cors= require("cors");
// const mysql = require("mysql") as any;

// const app =express();
// app.use(cors());

// const db= mysql.createConnection({
//     host:"localhost",
//     user:"root",
//     password:"",
//     database:"crud"
// });

// app.get("/",(req,res)=>{
//     const sql ="SELECT * FROM usercrud";
//     db.query(sql,(err,data)=>{
//         if(err) return res.json("error");
//         return res.json(data);
//     })
//     // res.json("hello");
// })

// app.listen(8080,()=>{
//    console.log("running");
// });




const express = require("express");
const cors = require("cors");
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies in requests

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Vaibhav@12345",
    database: "crud"
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

// Start the server
app.listen(8080, () => {
    console.log("Server running on port 8080");
});
