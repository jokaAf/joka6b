const { ObjectId } = require("mongodb");

module.exports = (app) => {
    app.get('/noticias/id/:id', async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "ID da notícia é obrigatório"
                });
            }

            const objectId = ObjectId.createFromHexString(id);
            
            await app.DBClient.connect();
            
            const noticia = await app.DBClient.db('portalnoticias')
                .collection('noticias')
                .findOne({ _id: objectId });

            if (!noticia) {
                return res.status(404).json({
                    success: false,
                    message: "Notícia não encontrada"
                });
            }

            res.status(200).json({
                success: true,
                data: [noticia] // Mantém compatibilidade com array
            });

        } catch (error) {
            console.error("Erro ao buscar notícia por ID:", error);
            
            if (error.message.includes('invalid ObjectId')) {
                return res.status(400).json({
                    success: false,
                    message: "ID inválido"
                });
            }

            res.status(500).json({
                success: false,
                message: "Erro interno ao buscar notícia",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });
}