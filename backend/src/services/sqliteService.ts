import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../Carteira.db');

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error('Erro ao conectar ao SQLite:', err.message);
    } else {
        console.log('Conectado ao banco de dados Carteira.db.');
    }
});

export const querySqlite = <T>(query: string, params: any[] = []): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows: T[]) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
};