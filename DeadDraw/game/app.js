const express = require('express')
const cors = require('cors')
const mysql = require('mysql2');
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

app.post('/login', (req, res) => {
    //const nombre = req.body.input;
    const username = req.body.username;
    const password = req.body.password;
    console.log("posted");
    const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Habana_12345',
        database: 'deaddraw'
    });
    connection.connect((err) => {
        if (err) throw err;
        console.log('Connected to MySQL Database!');
        // Example query             
        connection.query('select * from Player where email = ? and password = ?',[username,password], (err, results, fields) => {
            if (results.length == 0) {
                res.send("Incorrect password or email");
                results = null;
            }
            else{
                res.send(results);
                
            }
        });
        // Close the connection     
        connection.end();
    });
    //res.send("Ok")
});

app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log("posted");
    const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Habana_12345',
        database: 'deaddraw'
    });
    connection.connect((err) => {
        if (err) console.log(err);
        console.log('Connected to MySQL Database!');
        // Example query             
        connection.query('insert into Player(email, password) values(?, ?)',[username,password], (err, results, fields) => {
            if (err){
                if(err.code === 'ER_DUP_ENTRY'){
                    res.send("This email is already registered");
                    return;
                }
                    
                else{
                    res.send("Password must be at least 8 characters long");
                    return;
                }
            }
            connection.query('select * from Player where email = ?',username, (err, results, fields) => {
            res.send(results);
            console.log(results);
            });

            connection.end();
        });
        // Close the connection     
    });
    
});

app.post('/registerUsername', (req, res) => {
    const username = req.body.username;
    const mail = req.body.mail

    console.log("posted");
    const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Habana_12345',
        database: 'deaddraw'
    });
    connection.connect((err) => {
        if (err) throw err;
        console.log('Connected to MySQL Database!');
        // Example query   
                  
        connection.query('update Player set username = ? where idPlayer = ?',[username,mail.idPlayer], (err, results, fields) => {
            if (err){
                if(err.code === 'ER_DUP_ENTRY')
                    res.send("This username is taken");
            }
            console.log(results);
            res.send("Username registered");
        });
        // Close the connection     
        connection.end();
    });
    
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});