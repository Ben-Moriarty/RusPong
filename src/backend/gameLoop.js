const sqlite = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../vocab_db/vocab.db')
const db = new sqlite.Database(dbPath, (err) => {
    if(err) {
        console.error("Error creating database in gameLoop.js: ", err.message);
    }
})

function getRand() {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM russian_others ORDER BY RANDOM() LIMIT 1`, (err, row) => {
            if(err) {
                reject(err);
            }
            else {
                resolve(row);
            }
        });
    });
}

let gameOn = true;

async function loopGame() {
    while(gameOn) {
        const rand = await getRand();

        console.log(rand);
    }
}

loopGame();