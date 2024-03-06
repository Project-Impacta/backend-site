import express from 'express';

const app = express();
const port = 3000;

// Defina uma rota básica
app.get('/', (req, res) => {
    res.send('Bem-vindo à minha API!');
});

// Inicie o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
