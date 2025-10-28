
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config(); 

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: parseInt(process.env.PGPORT || '5432'), 
});

// testando para garantir que a conexão está OK ao iniciar o app
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erro ao conectar ao PostgreSQL:', err.message);
    } else {
        console.log('PostgreSQL conectado com sucesso! Tempo:', res.rows[0].now);
    }
});

export default pool;