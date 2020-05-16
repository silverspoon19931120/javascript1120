const Correios = require('node-correios');
const correios = new Correios();

module.exports = {

    store: async (req, res) => {

        try {
            
            const [ pac ] = await correios.calcPrecoPrazo({
                "nCdServico": "04510",                  // Código PAC
                "sCepOrigem": "13490000",               // CEP ORIGEM (string sem hífen)
                "sCepDestino": req.body.destZipCode,    // CEP DESTINO (string sem hífen)
                "nVlPeso": req.body.weight,             // Peso em gramas (string: "0,500")
                "nCdFormato": 1,                        // 1 – Formato caixa/pacote // 2 – Formato rolo/prisma // 3 – Envelope
                "nVlComprimento": req.body.length,      // Comprimento em centimetros (float)
                "nVlAltura": req.body.height,           // Altura em centimetros (float)
                "nVlLargura": req.body.width,           // Largura em centimetros (float)
                "nVlDiametro": req.body.diameter,       // Diametro em centimetros (float)
                "sCdMaoPropria": "N",                   // Serviço adicional "mão própria" (string: "S" para sim, "N" para não)
                "nVlValorDeclarado": 0,                 // Serviço adicional "valor declarado" (float: 0 para não)
                "sCdAvisoRecebimento": "N"              // Serviço adicional "aviso de recebimento" (string: "S" para sim, "N" para não)
            });
    
            const [ sedex ] = await correios.calcPrecoPrazo({
                "nCdServico": "04014",                  // Código SEDEX
                "sCepOrigem": "13490000",
                "sCepDestino": req.body.destZipCode,
                "nVlPeso": req.body.weight,
                "nCdFormato": 1,
                "nVlComprimento": req.body.length,
                "nVlAltura": req.body.height,
                "nVlLargura": req.body.width,
                "nVlDiametro": req.body.diameter,
                "sCdMaoPropria": "N",
                "nVlValorDeclarado": 0,
                "sCdAvisoRecebimento": "N"
            });

            return res.json({ pac, sedex });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'internal error' });
        }
    }
}