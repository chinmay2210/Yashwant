// database.js
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0
}).promise();

pool.getConnection()
  .then((connection) => {
    console.log('Database connected!');
    connection.release(); // Release the connection back to the pool
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error.message);
  });

class Database {
  constructor(tablename, columns) {
    this.tablename = tablename;
    this.columns = columns;
  }

  async create(placeholders, values) {
    const query = `INSERT INTO \`${this.tablename}\` (${this.columns.map(col => `\`${col}\``).join(",")}) VALUES ${placeholders}`;
    const [result] = await pool.query(query, values);
    return result.insertId;
  }

  async read(condition = '', values) {
    
    const query = `SELECT * FROM \`${this.tablename}\` ${condition ? 'WHERE ' + condition : ''}`;
    // console.log(query);
    const [result] = await pool.query(query, values);
    return result;
  }

  async update(condition = '', values, setClause) {
    const query = `UPDATE \`${this.tablename}\` SET ${setClause} ${condition ? 'WHERE ' + condition : ''}`;

    const [result] = await pool.query(query, values);
    return result;
}


  async delete(condition = '',values) {
    const query = `DELETE FROM \`${this.tablename}\` ${condition ? 'WHERE ' + condition : ''}`;
    const [result] = await pool.query(query,values);
    return result;
  }
}

export default Database;
// export {pool}
