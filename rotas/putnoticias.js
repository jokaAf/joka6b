const { ObjectId } = require("mongodb");

module.exports = (app) => {
    app.put('/putnoticias', async (req, res) => {
        try {
            const { _id, titulonoticia, conteudonoticia, tiponoticia } = req.body;
            
            // Validação dos campos
            if (!_id || !titulonoticia || !conteudonoticia || !tiponoticia) {
                return res.status(400).json({
                    success: false,
                    message: "Todos os campos são obrigatórios"
                });
            }

            const id = ObjectId.createFromHexString(_id);
            
            await app.DBClient.connect();
            
            const resultado = await app.DBClient.db('portalnoticias')
                .collection('noticias')
                .updateOne(
                    { _id: id },
                    {
                        $set: {
                            titulonoticia: titulonoticia.trim(),
                            conteudonoticia: conteudonoticia.trim(),
                            tiponoticia: tiponoticia.trim().toLowerCase(),
                            datahoraatualizacao: new Date().toLocaleString('pt-BR', {
                                timeZone: 'America/Cuiaba',
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            })
                        }
                    }
                );

            if (resultado.matchedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Notícia não encontrada"
                });
            }

            res.status(200).json({
                success: true,
                message: "Notícia atualizada com sucesso!",
                data: {
                    _id: _id,
                    titulonoticia,
                    tiponoticia
                }
            });

        } catch (error) {
            console.error("Erro na atualização:", error);
            
            if (error.message.includes('invalid ObjectId')) {
                return res.status(400).json({
                    success: false,
                    message: "ID inválido"
                });
            }

            res.status(500).json({
                success: false,
                message: "Erro interno ao atualizar a notícia",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });
}