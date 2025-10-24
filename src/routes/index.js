import express from 'express';

const router = express.Router();

//Ruta de home
router.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

export default router;