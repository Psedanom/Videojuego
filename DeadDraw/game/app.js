const express = require('express')
const cors = require('cors')
const mysql = require('mysql2');
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
app.post('/post', (req, res) => {
    //const nombre = req.body.input;
    console.log("posted");
    const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Pablouno1',
        database: 'DeadDraw'
    });
    connection.connect((err) => {
        if (err) throw err;
        console.log('Connected to MySQL Database!');
        // Example query             
        connection.query('select * from Jugador;', (err, results, fields) => {
            if (err) throw err;
            console.log(results);

        });
        // Close the connection     
        connection.end();
    });
    res.send("Ok")
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});