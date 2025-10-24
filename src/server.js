import dotenv from 'dotenv';
import app from './app.js';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
