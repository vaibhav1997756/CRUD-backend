const express = require("express");
const cors = require("cors");
const mysql = require('mysql2');
const multer = require('multer');
const XLSX = require('xlsx');

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies in requests

const port = 8080;

const upload = multer({ dest: 'uploads/' });

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


app.post('/upload', upload.single('file'), (req, res) => {
    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }

    try {
        // Read the uploaded Excel file
        const workbook = XLSX.readFile(req.file.path);
        
        // Assuming the first sheet contains the data
        const sheetName = workbook.SheetNames[0];
        const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Iterate over the rows and insert data into the database
        worksheet.forEach((row) => {
            const { name, email, phone } = row; // Ensure your Excel columns have these headers

            const sql = "INSERT INTO usercrud (`name`, `email`, `phone`, `created_at`) VALUES (?, ?, ?, NOW())";
            const values = [name, email, phone];

            db.query(sql, values, (err, result) => {
                if (err) {
                    console.error('Error inserting data: ', err);
                }
            });
        });

        return res.status(200).json({ message: "Data inserted successfully from Excel file." });

    } catch (err) {
        console.error('Error processing file: ', err);
        return res.status(500).json({ error: "Failed to process file" });
    }
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






