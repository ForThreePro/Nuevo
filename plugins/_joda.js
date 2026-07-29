let handler = async (m, { conn, args, participants, command }) => {
    if (!m.isGroup) return m.reply('Solo en grupos')

    let ps = participants.map(v => v.id)
    let user = ps.getRandom()
    if (args[0]) {
        let mentioned = m.mentionedJid[0]
        user = mentioned || (await conn.onWhatsApp(args[0]))[0]?.jid || user
    }

    let name = await conn.getName(user) || user.split('@')[0] // <- ARREGLADO
    let porcentaje = Math.floor(Math.random() * 101)

    let frases = {
        gay: [`confirmado por la NASA 🏳️‍🌈`, `le gusta la ñonga`, `más gay que una licuadora`],
        lesbiana: [`camionera nivel dios 🚛`, `team Rosalía`, `se le nota a kilómetros`],
        pajero: [`se la jala 5 veces al día`, `mano con callos`, `rey del pajeo`],
        pajera: [`no duerme por pajearse`, `dedos mágicos`, `reina del pajeo`],
        puto: [`le gusta por atrás`, `puto con orgullo`, `oficio: puto`],
        puta: [`cobra por hora`, `la más puta del barrio`, `tarifa? al imbox`],
        burro: [`cerebro de burro`, `más bruto que una piedra`, `burro certificado`],
        burra: [`burra total`, `dos neuronas nomás`, `burra nivel extrema`],
        chivo: [`apesta a chivo`, `ni con perfume se le quita`, `hediondo confirmado`],
        choro: [`mano larga`, `roba hasta wifi`, `choro profesional`],
        cachero: [`cacha con todo lo que se mueve`, `cacherazo nivel dios`, `vive cachando`],
        cauchera: [`se tira a todo`, `cauchera nivel dios`, `recontra facilota`],
        cabezon: [`cabeza de balón`, `pura cabeza y nada de cerebro`, `cabezón de mrd`],
        tragon: [`come como marrano`, `no se llena nunca`, `se come hasta el plato`],
        fresa: [`ni toca el piso`, `puro mall y Starbucks`, `fresa pitucasa`],
        pipero: [`vive pipero`, `huele a weed`, `fumón profesional`],
        muerto: [`no tiene ni pa un pan`, `muerto de hambre`, `pide prestado siempre`],
        bamba: [`todo lo que tiene es bamba`, `falso como billete de 3 soles`, `bamba nivel 1000`],
        yapa: [`pide yapa hasta en la farmacia`, `tacaño de mierda`, `codo de cemento`],
        caña: [`alcohólico confirmado`, `vive en caña`, `borracho 24/7`],
        floro: [`puro floro nomás`, `florero profesional`, `no le creas nada`],
        gil: [`gilazo de mierda`, `recontra gil`, `gil sin cura`],
        sapo: [`chismoso de mrd`, `todo lo cuenta`, `sapo soplón`],
        trome: [`el más capo`, `el mejor del grupo`, `trome nivel dios`],
        toxica: [`tóxica nivel Chernóbil`, `huye de ella`, `re tóxica`],
        toxico: [`tóxico nivel plutonio`, `huye de él`, `re tóxico`],
        simp: [`se arrastra por migajas`, `simp confirmado`, `paga por atención`],
        rata: [`rata de alcantarilla`, `roba hasta el aire`, `rata inmunda`],
        infiel: [`cacha por atrás`, `perro infiel`, `engaña hasta a su sombra`],
        fiel: [`recontra fiel`, `no engaña ni a palos`, `ejemplo a seguir`],
        bellaka: [`bellaka criminal`, `mala y lo sabe`, `peligrosa`],
        mentiroso: [`miente más que habla`, `pinocho`, `mentiroso compulsivo`],
        pitochico: [`micro pene`, `no se le ve`, `de adorno nomás`],
        rica: [`esta buena`, `papazota`, `dios la hizo y rompió el molde`],
        mostro: [`mostro de los mostros`, `capo`, `trome nivel dios`],
        miamor: [`mi amorcito`, `te amo bb`, `mi vida`],
        mibebito: [`mi bebito fiu fiu`, `bebé`, `mi niño`],
        bratz: [`muñeca bratz`, `reina bratz`, `hermosa`],
        brother: [`mi brother`, `hermano`, `patazo`],
        duo: [`el mejor duo`, `duo dinamico`, `hacen buena pareja`],
        perroinfiel: [`perro infiel`, `cacha y niega`, `no sirve`]
    }

    let listaFrases = frases[command] || [`confirmado al ${porcentaje}%`]
    let fraseRandom = listaFrases[Math.floor(Math.random() * listaFrases.length)]

    let texto = `*${command.toUpperCase()}*\n\n@${name} es *${porcentaje}%* ${command.toUpperCase()}\n> _${fraseRandom}_`

    await conn.sendMessage(m.chat, {
        text: texto,
        mentions: [user] // ESTO HACE QUE SALGA AZUL
    }, { quoted: m })
}

handler.help = ['gay', 'lesbiana', 'pajero', 'puto', 'burro', 'chivo', 'choro', 'cachero', 'tragon', 'fresa', 'pipero', 'muerto', 'bamba', 'yapa', 'caña', 'pata', 'floro', 'gil', 'chibolo', 'viejo', 'grasa', 'pituco', 'sapo', 'pavo', 'trome', 'reina', 'king', 'zombie', 'toxica', 'simp', 'vago', 'loquito', 'manco', 'rata', 'fiel', 'infiel', 'miamor', 'bellaka', 'brother', 'mentiroso', 'duo', 'chipi', 'feo', 'rica', 'mostro']
handler.tags = ['fun']
handler.command = /^(gay|lesbiana|pajero|pajera|puto|puta|burro|burra|kbro|chivo|kchera|choro|cachero|cauchera|cabez[oó]n|jinetero|sangre|trag[oó]n|fresa|pipero|muerto|bamba|yapa|caña|pata|floro|miserable|gil|gilasa|lenteja|chibolo|chibola|viejo|vieja|grasa|graso|pituco|pituca|sapa|sapo|pavo|pava|trome|reina|king|zombie|t[oó]xica|t[oó]xico|simp|vago|vaga|loquito|manco|manca|rata|prostituta|prostituto|fiel|infiel|miamor|mi amor|mibebito|bratz|bellaka|brother|perroinfiel|perro infiel|mentiroso|mentiras|2p2|3p3|duo|chipi|sintetas|sinpoto|sinpito|pitochico|feo|fea|rica|horrible|mostro|mostra|soylindo|soylinda)$/i
handler.group = true

export default handler