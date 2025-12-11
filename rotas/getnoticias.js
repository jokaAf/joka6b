module.exports = (app) => {
    app.get('/noticias', async (req, res) => {
        try {
            await app.DBClient.connect();
            
            const noticias = await app.DBClient.db('portalnoticias')
                .collection('noticias')
                .find()
                .sort({ datahoracadastro: -1 }) // Ordena por data mais recente
                .toArray();

            res.status(200).json({
                success: true,
                count: noticias.length,
                data: noticias
            });

        } catch (error) {
            console.error("Erro ao buscar notícias:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno ao buscar notícias",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });
}