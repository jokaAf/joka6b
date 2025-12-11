// Use "type: commonjs" in package.json to use CommonJS modules
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (CSS, JS, imagens)
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Configuração do banco de dados
require("./db/db")(app);

// Rotas
require("./rotas/home")(app);
require("./rotas/getnoticias")(app);
require("./rotas/getidnoticias")(app);
require("./rotas/gettiponoticias")(app);
require("./rotas/putnoticias")(app);
require("./rotas/postnoticias")(app);
require("./rotas/delnoticias")(app);

// Rota para servir o CSS
app.get('/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'styles.css'));
});

// Rota 404 personalizada
app.use((req, res) => {
    res.status(404).render('404', { title: 'Página não encontrada' });
});

// Middleware de erro
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        title: 'Erro no servidor',
        message: 'Ocorreu um erro no servidor. Por favor, tente novamente mais tarde.' 
    });
});

app.listen(port, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${port}`);
    console.log(`📰 Portal de Notícias pronto para uso!`);
});