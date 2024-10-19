import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'


export interface DatabaseSchema{
    NodeName: string,
    NodeRoute: string,
    Enabled: boolean
}


export class DatabaseHelper{
    database_path: string;

    constructor(db_path: string) {
        this.database_path = db_path;
    }

    init_database = async (): Promise<any> =>{
        const db = await open({
            filename: this.database_path,
            driver: sqlite3.Database
        });

        await db.exec(`
            CREATE TABLE IF NOT EXISTS Nodes (
                NodeName TEXT,
                NodeRoute TEXT,
                Enabled BOOL
            )
        `);

        console.log('Database initialized. Table `Nodes` created if not existing prior.');
        return db;
    }

    close_database = async (db: sqlite3.Database): Promise<void | boolean> => {
        try{
            await db.close();
            console.log("Database connection successfully closed.");
        } catch (error){
            console.log("Error closing the database: ", error);
            return false;
        }
    }

    insert_into_database = async (db: sqlite3.Database, row: DatabaseSchema): Promise<void | boolean> =>{
        try{
            await db.run(`
                INSERT INTO Nodes (
                    NodeName, NodeRoute, Enabled
                ) VALUES (?, ?, ?)`,
                row.NodeName,
                row.NodeRoute,
                row.Enabled
            );
            console.log('Inserted new row: ', row);
        } catch (error){
            console.log("Error inserting new row: ", error);
            return false;
        }
    }

    get_all_rows = async (): Promise<any> => {
        return new Promise((resolve, reject) => {
            const db = new sqlite3.Database('./nodes.db');

            db.all("SELECT * FROM Nodes", (error, rows) => {
                if (error) {
                    reject(error); // Handle the error
                } else {
                    resolve(rows); // Resolve with the fetched rows
                }

                db.close((err) => {
                    if (err) {
                        console.error('Error closing the database:', err);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            });
        });
    };

}

