let handler = async (m, { conn, args, participants, command }) => {
    if (!m.isGroup) return m.reply('Solo en grupos')

    let ps = participants.map(v => v.id)
    let user = ps.getRandom()
    if (args[0]) user = (await conn.onWhatsApp(args[0]))[0]?.jid || user

    let name = await conn.getName(user)
    let porcentaje = Math.floor(Math.random() * 101)

    // BASE DE FRASES POR COMANDO
    let frases = {
        gay: [
            `confirmado por la NASA 🏳️‍🌈`,
            `le gusta la ñonga`,
            `bandera arcoiris activada`,
            `más gay que una licuadora`
        ],
        lesbiana: [
            `camionera nivel dios 🚛`,
            `odia a los hombres`,
            `team Rosalía`,
            `se le nota a kilómetros`
        ],
        pajero: [
            `se la jala 5 veces al día`,
            `mano con callos`,
            `vive en el baño`,
            `rey del pajeo`
        ],
        pajera: [
            `no duerme por pajearse`,
            `dedos mágicos`,
            `adieta al vibrador`,
            `reina del pajeo`
        ],
        puto: [
            `le gusta por atrás`,
            `puto con orgullo`,
            `oficio: puto`,
            `se vende barato`
        ],
        puta: [
            `cobra por hora`,
            `la más puta del barrio`,
            `oficio: puta`,
            `tarifa? al imbox`
        ],
        burro: [
            `cerebro de burro`,
            `más bruto que una piedra`,
            `no le da para más`,
            `burro certificado`
        ],
        burra: [
            `burra total`,
            `dos neuronas nomás`,
            `más perdida que huevo en ceviche`,
            `burra nivel extrema`
        ],
        chivo: [
            `apesta a chivo`,
            `ni con perfume se le quita`,
            `pata hedionda`,
            `hediondo confirmado`
        ],
        choro: [
            `mano larga`,
            `roba hasta wifi`,
            `ratero de mrd`,
            `choro profesional`
        ],
        cachero: [
            `cacha con todo lo que se mueve`,
            `no perdona a nadie`,
            `cacherazo nivel dios`,
            `vive cachando`
        ],
        cauchera: [
            `se tira a todo`,
            `cauchera nivel dios`,
            `no discrimina`,
            `recontra facilota`
        ],
        cabezon: [
            `cabeza de balón`,
            `pura cabeza y nada de cerebro`,
            `cabezón de mrd`,
            `le entra agua por las orejas`
        ],
        tragon: [
            `come como marrano`,
            `no se llena nunca`,
            `gordo tragón`,
            `se come hasta el plato`
        ],
        fresa: [
            `ni toca el piso`,
            `puro mall y Starbucks`,
            `fresa pitucasa`,
            `habla cantadito`
        ],
        pipero: [
            `vive pipero`,
            `huele a weed`,
            `fumón profesional`,
            `24/7 con pipa`
        ],
        muerto: [
            `no tiene ni pa un pan`,
            `muerto de hambre`,
            `pide prestado siempre`,
            `plata? qué es eso`
        ],
        bamba: [
            `todo lo que tiene es bamba`,
            `recontra bamba`,
            `falso como billete de 3 soles`,
            `bamba nivel 1000`
        ],
        yapa: [
            `pide yapa hasta en la farmacia`,
            `tacaño de mierda`,
            `codo de cemento`,
            `ni un sol extra da`
        ],
        caña: [
            `alcohólico confirmado`,
            `vive en caña`,
            `borracho 24/7`,
            `cañero nivel dios`
        ],
        floro: [
            `puro floro nomás`,
            `florero profesional`,
            `no le creas nada`,
            `miente más que habla`
        ],
        gil: [
            `gilazo de mierda`,
            `recontra gil`,
            `gil sin cura`,
            `le ven la cara`
        ],
        sapo: [
            `chismoso de mrd`,
            `todo lo cuenta`,
            `sapo soplón`,
            `sapa nivel dios`
        ],
        trome: [
            `el más capo`,
            `el mejor del grupo`,
            `trome nivel dios`,
            `nadie le gana`
        ],
        toxica: [
            `tóxica nivel Chernóbil`,
            `huye de ella`,
            `problemas andantes`,
            `re tóxica`
        ],
        simp: [
            `se arrastra por migajas`,
            `simp confirmado`,
            `paga por atención`,
            `simp de manual`
        ],
        rata: [
            `rata de alcantarilla`,
            `roba hasta el aire`,
            `rata inmunda`,
            `no tiene sangre en la cara`
        ],
        infiel: [
            `cacha por atrás`,
            `perro infiel`,
            `no sirve para nada`,
            `engaña hasta a su sombra`
        ],
        bellaka: [
            `bellaka criminal`,
            `mala y lo sabe`,
            `peligrosa`,
            `no se enamora`
        ],
        mentiroso: [
            `miente más que habla`,
            `pinocho`,
            `no dice ni una verdad`,
            `mentiroso compulsivo`
        ],
        pitochico: [
            `micro pene`,
            `no se le ve`,
            `de adorno nomás`,
            `2cm y es mucho`
        ],
        rica: [
            `esta buena`,
            `papazota`,
            `que rico`,
            `dios la hizo y rompió el molde`
        ],
        mostro: [
            `mostro de los mostros`,
            `capo`,
            `el mejor`,
            `trome nivel dios`
        ]
    }

    // Si no tiene frases, usa una genérica
    let listaFrases = frases[command] || [`confirmado al ${porcentaje}%`, `estudio científico lo dice`]
    let fraseRandom = listaFrases[Math.floor(Math.random() * listaFrases.length)]

    let texto = `*${command.toUpperCase()}*\n\n@${name.split('@')[0]} es *${porcentaje}%* ${command.toUpperCase()}\n> _${fraseRandom}_`

    await conn.reply(m.chat, texto, m, { mentions: [user] })
}

handler.help = ['gay', 'lesbiana', 'pajero', 'puto', 'burro', 'chivo', 'choro', 'cachero', 'tragon', 'fresa', 'pipero', 'muerto', 'bamba', 'yapa', 'caña', 'pata', 'floro', 'gil', 'chibolo', 'viejo', 'grasa', 'pituco', 'sapo', 'pavo', 'trome', 'reina', 'king', 'zombie', 'toxica', 'simp', 'vago', 'loquito', 'manco', 'rata', 'fiel', 'infiel', 'miamor', 'bellaka', 'brother', 'mentiroso', 'duo', 'chipi', 'feo', 'rica', 'mostro']
handler.tags = ['Diversion']
handler.command = /^(gay|lesbiana|pajero|pajera|puto|puta|burro|burra|kbro|chivo|kchera|choro|cachero|cauchera|cabez[oó]n|jinetero|sangre|trag[oó]n|fresa|pipero|muerto|bamba|yapa|caña|pata|floro|miserable|gil|gilasa|lenteja|chibolo|chibola|viejo|vieja|grasa|graso|pituco|pituca|sapa|sapo|pavo|pava|trome|reina|king|zombie|t[oó]xica|t[oó]xico|simp|vago|vaga|loquito|manco|manca|rata|prostituta|prostituto|fiel|infiel|miamor|mi amor|mibebito|bratz|bellaka|brother|perroinfiel|perro infiel|mentiroso|mentiras|2p2|3p3|duo|chipi|sintetas|sinpoto|sinpito|pitochico|feo|fea|rica|horrible|mostro|mostra|soylindo|soylinda)$/i
handler.group = true

export default handler