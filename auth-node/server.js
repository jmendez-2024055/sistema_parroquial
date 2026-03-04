require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/eventos', require('./src/routes/evento.routes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});