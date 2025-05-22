const { parse } = require('csv');
const fs = require('fs');
const path = require('path');
const sqlite = require('sqlite3').verbose();

const pathToOthers = path.join(__dirname, '../vocab_csv/russian/others.csv');
const fileData = fs.readFileSync(pathToOthers, 'utf8');

parse(fileData, {
    columns: ['bare', null, 'translations_en', null],
    relax_column_count: true,
    skip_emtpy_lines: true,
    delimiter: '\t',
    quote: null
    }, 
    (err, data) => {
        if(err) {
            console.error("Error while parsing csv: ", err);
            return;
        }

        const filtered = data.filter(row => row.bare && row.translations_en);

        console.log("Parse Success:");
        console.log(data);
    
        
        const dbPath = path.join(__dirname, '../vocab_db/vocab.db');
        const db = new sqlite.Database(dbPath, (dbOpenErr) => {
            if(dbOpenErr) {
                console.log("Error opening database: ", dbOpenErr);
            }

            db.serialize(() => { 
                if(process.argv[2] == 'clean') {
                     db.run(
                        `DELETE FROM russian_others`,
                        (err) => {
                            if(err) {
                                return console.error('Error clearing russin others: ', err.message);
                            }
                        }
                    )
                    db.run(
                        `DELETE FROM sqlite_sequence WHERE name='russian_others'`,
                        (err) => {
                            if(err) {
                                return console.error('Error cleaning table: ', err.message);
                            }
                        }
                    );
                }
                const createRussianOthers = `
                    CREATE TABLE IF NOT EXISTS russian_others
                    (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        russian TEXT,
                        english TEXT,
                        UNIQUE(russian, english)
                    );
                `;

                db.run(createRussianOthers, (err) => {
                    if(err) {
                        console.log('Error creating russian others table');
                        return;
                    }
                    console.log('Russian others table already exists or was created');
                });

                for (const obj of filtered) {
                    db.run(
                        `INSERT OR IGNORE INTO russian_others (russian, english) VALUES (?, ?)`,
                        [obj.bare, obj.translations_en],
                        (err) => {
                            if(err) {
                                return console.error('Insert into russian_others failed: ', err.message)
                            }
                        }
                    );
                }
            });
       });
    }
);
