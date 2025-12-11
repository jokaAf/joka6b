module.exports = (app) => {
    app.get('/noticias/tiponoticia/:tipo', async (req, res) => {
        try {
            const { tipo } = req.params;
            
            if (!tipo) {
                return res.status(400).json({
                    success: false,
                    message: "Tipo de notícia é obrigatório"
                });
            }

            await app.DBClient.connect();
            
            const noticias = await app.DBClient.db('portalnoticias')
                .collection('noticias')
                .find({ tiponoticia: tipo.toLowerCase() })
                .sort({ datahoracadastro: -1 })
                .toArray();

            res.status(200).json({
                success: true,
                count: noticias.length,
                tipo: tipo,
                data: noticias
            });

        } catch (error) {
            console.error("Erro ao buscar notícias por tipo:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno ao buscar notícias por tipo",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });
}