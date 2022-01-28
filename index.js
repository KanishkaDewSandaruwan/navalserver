const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const multer = require('multer');
const { error } = require('console');

const pdfStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'pdf');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload',)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })
const pdfUpload = multer({ storage: pdfStorage })

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '',
    database: 'naval',
});


//Book Database

app.get('/book/view', (req, res) => {
    db.query("SELECT * FROM book", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
})

app.post('/book/pdf', pdfUpload.single('book'), (req, res) => {
    const pdffile = req.file.filename;
    res.send(pdffile);
})

app.post('/book/newbook', upload.single('file'), (req, res) => {
    let body = req.body;

    const title = body.title;
    const author = body.author;
    const description = body.description;
    const price = body.price;
    const imagefile = req.file.filename;
    const pdffile = body.pdf;

    let date_ob = new Date();

    // current date
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    const cdate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

    db.query("INSERT INTO book(title, author, description, price, image, pdf_file, cdate) VALUES(?, ?, ?, ?, ?, ?, ?)", [title, author, description, price, imagefile, pdffile, cdate], (err, result) => {

        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

// Author CRUD Start

app.delete('/author/delete/:author_id', (req, res) => {
    const author_id = req.params.author_id;
    db.query("DELETE FROM author WHERE author_id = ?", author_id, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.put('/author/edit', (req, res) => {
    const author_id = req.body.author_id;
    const name = req.body.name;
    const description = req.body.description;
    const email = req.body.email;

    if (name) {
        db.query("UPDATE author SET name = ? WHERE author_id = ?", [name, author_id], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        })
    };

    if (description) {
        db.query("UPDATE author SET description = ? WHERE author_id = ?", [description, author_id], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        })
    };

    if (email) {
        db.query("UPDATE author SET email = ? WHERE author_id = ?", [email, author_id], (err, result) => {
            if (err) {
                console.log(err);
            } else {
                res.send(result);
            }
        })
    };

});

app.get('/author/view', (req, res) => {
    db.query("SELECT * FROM author", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
});

app.post('/author/authorLogin', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    console.log(email + ' ' + password)

    db.query("SELECT * FROM author WHERE email = ? AND password = ? ", [email, password], (err, result) => {
        if (err) {
            res.send({err: err});
        }

        if (result.length > 0) {
            res.send(result);
            console.log(result)
        } else {
            res.send({message:"Email or Password is Wrong"})
        }

    });
});

app.post('/author/create', (req, res) => {
    const name = req.body.name;
    const description = req.body.description;
    const address = req.body.address;
    const phone = req.body.phone;
    const gender = req.body.gender;
    const accept = 'No';
    const password = req.body.password;
    const email = req.body.email;

    let date_ob = new Date();

    // current date
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();

    const cdate = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

    db.query("INSERT INTO author(name, description,address, phone, gender, email, password, cdate, accept) VALUES(?,?,?,?,?,?,?,?,?)", [name, description, address, phone, gender, email, password, cdate, accept], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send("Author Added Success!");
        }
    })
})

app.put('/author/accept', (req, res) => {

    const accept = 'Yes';
    const email = req.body.email;

    db.query("UPDATE author SET  accept = ? WHERE email = ? ", [accept, email], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send("Your Registration is Success!");
        }
    })
})

app.listen(3001, () => {
    console.log("Server started");
});