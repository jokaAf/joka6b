const { ObjectId } = require("mongodb");

module.exports = (app) => {
    app.delete('/delnoticias', async (req, res) => {
        try {
            const { _id } = req.body;
            
            if (!_id) {
                return res.status(400).json({
                    success: false,
                    message: "ID da notícia é obrigatório"
                });
            }

            const id = ObjectId.createFromHexString(_id);
            
            await app.DBClient.connect();
            
            const resultado = await app.DBClient.db('portalnoticias')
                .collection('noticias')
                .deleteOne({ _id: id });

            if (resultado.deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Notícia não encontrada"
                });
            }

            res.status(200).json({
                success: true,
                message: "Notícia excluída com sucesso!"
            });

        } catch (error) {
            console.error("Erro na exclusão:", error);
            
            if (error.message.includes('invalid ObjectId')) {
                return res.status(400).json({
                    success: false,
                    message: "ID inválido"
                });
            }

            res.status(500).json({
                success: false,
                message: "Erro interno ao excluir a notícia",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });
}