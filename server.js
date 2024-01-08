const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'PollDB',
  password: '9740',
  port: 5432,
});

app.post('/vote', async (req, res) => {
  try {
    const { name, voting_choice, casted_at } = req.body;
    const result = await pool.query(
      'INSERT INTO votes (name, voting_choice, casted_at) VALUES ($1, $2, $3) RETURNING *',
      [name, voting_choice, casted_at]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error submitting vote:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM votes');
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error('Error fetching vote data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/counts', async (req, res) => {
  try {
    const { voting_choice } = req.query;
    const result = await pool.query(
      'SELECT COUNT(*) AS count, casted_at FROM votes WHERE voting_choice = $1 GROUP BY casted_at',
      [voting_choice]
    );
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error('Error fetching vote counts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/results', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) AS count, voting_choice FROM votes GROUP BY voting_choice');
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error('Error fetching overall results:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
