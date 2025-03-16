const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); // Importando o pacote cors
const app = express();
const PORT = 5000;

// Configuração do multer para armazenar arquivos na pasta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

app.use(cors()); // Usando o middleware cors
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rota para upload de arquivos
app.post('/upload', upload.single('avatar'), (req, res) => {
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});