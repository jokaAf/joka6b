module.exports = (app) => {
    app.post('/postnoticias', async (req, res) => {
        try {
            const { titulonoticia, conteudonoticia, tiponoticia } = req.body;
            
            // Validação dos campos
            if (!titulonoticia || !conteudonoticia || !tiponoticia) {
                return res.status(400).json({
                    success: false,
                    message: "Todos os campos são obrigatórios"
                });
            }

            await app.DBClient.connect();
            
            const resultado = await app.DBClient.db('portalnoticias')
                .collection('noticias')
                .insertOne({
                    titulonoticia: titulonoticia.trim(),
                    conteudonoticia: conteudonoticia.trim(),
                    tiponoticia: tiponoticia.trim().toLowerCase(),
                    datahoracadastro: new Date().toLocaleString('pt-BR', { 
                        timeZone: 'America/Cuiaba',
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                    })
                });

            if (!resultado.acknowledged) {
                return res.status(500).json({
                    success: false,
                    message: "Erro ao cadastrar notícia"
                });
            }

            res.status(201).json({
                success: true,
                message: "Notícia cadastrada com sucesso!",
                data: {
                    _id: resultado.insertedId,
                    titulonoticia,
                    tiponoticia
                }
            });

        } catch (error) {
            console.error("Erro no cadastro:", error);
            res.status(500).json({
                success: false,
                message: "Erro interno ao cadastrar a notícia",
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });
}