const express = require('express')
const cors = require('cors')
const mysql = require('mysql2');
const app = express()
const port = 3000

const dbpassword = "Pablouno1";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

/* función reutilizable para no repetir la conexión en cada endpoint */
function conectar() {
    return mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: dbpassword,
        database: 'DeadDraw'
    });
}

app.post('/resetDefault', (req, res) => {
    const id = req.body.id;
    const connection = conectar();
    connection.connect((err) => {
        if (err) throw err;
        connection.query('SELECT baseHealth, baseTime FROM Player WHERE idPlayer = ?', [id], (err, results) => {
            if (err || results.length === 0) {
                connection.end();
                return res.status(400).send("Player not found");
            }
            const { baseHealth, baseTime } = results[0];
            connection.query(
                'UPDATE Player SET healthLeft = ?, timeLeft = ?, level = 0 WHERE idPlayer = ?',
                [baseHealth, baseTime, id],
                (err) => {
                    connection.query('DELETE FROM playercard WHERE idPlayer = ?', [id], () => {
                        connection.end();
                        res.json({ baseHealth, baseTime });
                    });
                }
            );
        });
    });
});

app.post('/passHealth', (req, res) => {
    const id = req.body.id;
    const baseHealth = req.body.baseHealth;
    const connection = conectar();
    connection.connect((err) => {
        if (err) throw err;
        connection.query('update Player set baseHealth = ? where idPlayer = ?', [baseHealth, id], (err, results) => {
            res.send("Health updated");
        });
        connection.end();
    });
});
app.post('/passTime', (req, res) => {
    const id = req.body.id;
    const baseTime = req.body.baseTime;
    const connection = conectar();
    connection.connect((err) => {
        if (err) throw err;
        connection.query('update Player set baseTime = ? where idPlayer = ?', [baseTime, id], (err, results) => {
            res.send("Time updated");
        });
        connection.end();
    });
});
app.post('/saveProgress', (req, res) => {
    const id = req.body.id;
    const healthLeft = req.body.healthLeft;
    const timeLeft = req.body.timeLeft;
    const level = req.body.level;
    const connection = conectar();
    connection.connect((err) => {
        if (err) throw err;
        connection.query('update Player set healthLeft = ?, timeLeft = ?, level = ? where idPlayer = ?', [healthLeft, timeLeft,level, id], (err, results) => {
            res.send("Progress saved");
        });
        connection.end();
    });
});

app.post('/money', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const money = req.body.money;
    const connection = conectar();
    connection.connect((err) => {
        if (err) throw err;
        connection.query('update Player set money = money + ? where email = ? and password = ?',[money,username,password], (err, results) => {
            res.send("Money added");
        });
        connection.end();
    });
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const connection = conectar();
    connection.connect((err) => {
        if (err) throw err;
        connection.query('select * from Player where email = ? and password = ?',[username,password], (err, results) => {
            if (results.length == 0) {
                res.send("Incorrect password or email");
            } else {
                res.send(results);
            }
        });
        connection.end();
    });
});

app.post('/register', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const connection = conectar();
    connection.connect((err) => {
        if (err) console.log(err);
        connection.query('insert into Player(email, password) values(?, ?)',[username,password], (err, results) => {
            if (err){
                if(err.code === 'ER_DUP_ENTRY'){
                    res.send("This email is already registered");
                    return;
                } else {
                    res.send("Password must be at least 8 characters long");
                    return;
                }
            }
            connection.query('select * from Player where email = ?', username, (err, results) => {
                res.send(results);
            });
            connection.end();
        });
    });
});

app.post('/registerUsername', (req, res) => {
    const username = req.body.username;
    const mail = req.body.mail;
    const connection = conectar();
    connection.connect((err) => {
        if (err) throw err;
        connection.query('update Player set username = ? where idPlayer = ?',[username,mail.idPlayer], (err, results) => {
            if (err){
                if(err.code === 'ER_DUP_ENTRY')
                    res.send("This username is taken");
            }
            res.send("Username registered");
        });
        connection.end();
    });
});

/* ── ENDPOINTS DE ADMIN ── */

app.get('/admin/activos', (req, res) => {
    const connection = conectar();
    connection.connect((err) => { if (err) throw err; });
    connection.query(
        'SELECT COUNT(*) as total FROM Logbook WHERE disconnectionTime IS NULL',
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.send(results[0]);
        }
    );
    connection.end();
});

app.get('/admin/partidas-hoy', (req, res) => {
    const connection = conectar();
    connection.connect((err) => { if (err) throw err; });
    connection.query(
        'SELECT COUNT(*) as total FROM MatchGame WHERE DATE(startDate) = CURDATE()',
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.send(results[0]);
        }
    );
    connection.end();
});

app.get('/admin/duracion', (req, res) => {
    const connection = conectar();
    connection.connect((err) => { if (err) throw err; });
    connection.query(
        'SELECT ROUND(AVG(TIMESTAMPDIFF(MINUTE, startDate, endDate)), 1) as promedio FROM MatchGame WHERE endDate IS NOT NULL',
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.send(results[0]);
        }
    );
    connection.end();
});

app.get('/admin/abandono', (req, res) => {
    const connection = conectar();
    connection.connect((err) => { if (err) throw err; });
    connection.query(
        `SELECT ROUND(SUM(result = 'defeat') / COUNT(*) * 100, 1) as porcentaje 
         FROM MatchGame WHERE result != 'in progress'`,
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.send(results[0]);
        }
    );
    connection.end();
});

app.get('/admin/frecuencia', (req, res) => {
    const connection = conectar();
    connection.connect((err) => { if (err) throw err; });
    connection.query(
        `SELECT DATE(startDate) as dia, COUNT(*) as total
         FROM MatchGame
         WHERE startDate >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
         GROUP BY DATE(startDate)
         ORDER BY dia ASC`,
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.send(results);
        }
    );
    connection.end();
});

app.get('/admin/resultados', (req, res) => {
    const connection = conectar();
    connection.connect((err) => { if (err) throw err; });
    connection.query(
        `SELECT result, COUNT(*) as total
         FROM MatchGame
         WHERE result != 'in progress'
         GROUP BY result`,
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.send(results);
        }
    );
    connection.end();
});

app.get('/admin/actividad', (req, res) => {
    const connection = conectar();
    connection.connect((err) => { if (err) throw err; });
    connection.query(
        `SELECT HOUR(connectionTime) as hora, COUNT(*) as total
         FROM Logbook
         GROUP BY HOUR(connectionTime)
         ORDER BY hora ASC`,
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.send(results);
        }
    );
    connection.end();
});

app.get('/admin/jugadores', (req, res) => {
    const connection = conectar();
    connection.connect((err) => { if (err) throw err; });
    connection.query(
        `SELECT 
            p.username,
            COUNT(m.idMatchGame) as partidas,
            MAX(l.connectionTime) as ultimaConexion,
            IF(SUM(l.disconnectionTime IS NULL) > 0, 'activo', 'inactivo') as estado
         FROM Player p
         LEFT JOIN MatchGame m ON p.idPlayer = m.idPlayer
         LEFT JOIN Logbook l ON p.idPlayer = l.idPlayer
         GROUP BY p.idPlayer, p.username
         ORDER BY partidas DESC`,
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.send(results);
        }
    );
    connection.end();
});

app.post('/saveMatch', (req, res) => {
    const idPlayer = req.body.idPlayer;
    const idDeck   = req.body.idDeck;
    const score    = req.body.score;
    const connection = conectar();
    connection.connect((err) => {
        if (err) throw err;
        connection.query(
            'INSERT INTO MatchGame (idPlayer, idDeck, score, result, endDate) VALUES (?, ?, ?, \'victory\', NOW())',
            [idPlayer, idDeck, score],
            (err, results) => {
                connection.end();
                if (err) return res.status(500).send(err);
                res.json({ idMatchGame: results.insertId });
            }
        );
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});


app.get('/deck1', (req, res) => {
    const connection = conectar();
    connection.connect((err) => { if (err) throw err; });
    connection.query(
        'SELECT card.number,type,used,inboard from deck inner join cardindeck using (idDeck) inner join card using (idCard) where idDeck = 1',
        (err, results) => {
            res.send(results);
        }
    );
    connection.end();
});
app.get('/deck2', (req, res) => {
    const connection = conectar();
    connection.connect((err) => { if (err) throw err; });
    connection.query(
        'SELECT card.number,type,used,inboard from deck inner join cardindeck using (idDeck) inner join card using (idCard) where idDeck = 2',
        (err, results) => {
            res.send(results);
        }
    );
    connection.end();
});
app.get('/deck3', (req, res) => {
    const connection = conectar();
    connection.connect((err) => { if (err) throw err; });
    connection.query(
        'SELECT card.number,type,used,inboard from deck inner join cardindeck using (idDeck) inner join card using (idCard) where idDeck = 3',
        (err, results) => {
            res.send(results);
        }
    );
    connection.end();
});
app.get('/player', (req, res) => {
    const connection = conectar();
    connection.connect((err) => { if (err) throw err; });
    connection.query(
        'SELECT * from playercard where idPlayer = ?',[req.query.idPlayer],
        (err, results) => {
            res.send(results);
        }
    );
    connection.end();
});

app.post('/guardar', (req, res) => {
    const connection = conectar();
    const carta = req.body.cartas;
    const id = req.body.playerid;
    connection.connect((err) => { if (err) throw err; });
    connection.query(
        'insert into playercard (idPlayer,number,type,used,inboard) values (?,?,?,?,?)',[id,carta.number,carta.type,carta.used,carta.inboard],
        (err, results) => {
            res.send(results);
        }
    );
    connection.end();
});
app.post('/delete', (req, res) => {
    const id = req.body.id;
    const connection = conectar();
    connection.connect((err) => { if (err) throw err; });
    connection.query('DELETE FROM playercard WHERE idPlayer = ?', [id], (err, results) => {
        res.send(results);
    });
    connection.end();
});
app.post('/saveMoney', (req, res) => {
    const id = req.body.id;
    const money = req.body.money;
    const connection = conectar();
    connection.connect((err) => { if (err) throw err; });
    connection.query('UPDATE Player SET money = ? WHERE idPlayer = ?', [money, id], (err, results) => {
        res.send(results);
    });
    connection.end();
});