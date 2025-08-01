const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { client } = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await client.query('SELECT * FROM keepers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (e) {
    next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await client.query('SELECT * FROM keepers WHERE id=$1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Keeper not found' });
    res.json(result.rows[0]);
  } catch (e) {
    next(e);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, specialty, sector, available, experience } = req.body;
    const id = uuidv4();
    const result = await client.query(
      `INSERT INTO keepers (id, name, specialty, sector, available, experience)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [id, name, specialty, sector, available ?? true, experience]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    next(e);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = [];
    const values = [];
    let idx = 1;
    for (const [k, v] of Object.entries(req.body)) {
      fields.push(`${k}=$${idx++}`);
      values.push(v);
    }
    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });
    values.push(id);
    const query = `UPDATE keepers SET ${fields.join(', ')} WHERE id=$${idx} RETURNING *`;
    const result = await client.query(query, values);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Keeper not found' });
    res.json(result.rows[0]);
  } catch (e) {
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await client.query('DELETE FROM keepers WHERE id=$1', [id]);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
});

module.exports = router;
