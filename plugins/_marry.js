let handler = async (m, { conn, usedPrefix, command }) => {
    // SOLO AGARRA SI RESPONDES
    let who = m.quoted? m.quoted.sender : null

    const IMG_CASAMIENTO = 'https://files.evogb.win/zu9HrE.jpg'
    const IMG_DIVORCIO = 'https://files.evogb.win/bftECK.jpg'

    global.db.data.users[m.sender] = global.db.data.users[m.sender] || { pareja: null }

    if (command == 'marry' || command == 'casar') {
        if (!who) return m.reply(`💍 *USO CORRECTO:*\n1. Ve al mensaje de la persona\n2. Dale *Responder*\n3. Escribe *.marry*\n\n*Tu bot no detecta @menciones*`)
        if (who === m.sender) return m.reply('🙄 *No te puedes casar contigo mismo xd*')

        global.db.data.users[who] = global.db.data.users[who] || { pareja: null }
        let user = global.db.data.users[m.sender]
        let target = global.db.data.users[who]

        if (user.pareja) {
            let ex = await conn.getName(user.pareja)
            return conn.reply(m.chat, `💍 *Ya estás casado con @${ex}*`, m, { mentions: [user.pareja] })
        }
        if (target.pareja) {
            let nameTarget = await conn.getName(who)
            let ex2 = await conn.getName(target.pareja)
            return conn.reply(m.chat, `💔 *@${nameTarget} ya tiene pareja con @${ex2}*`, m, { mentions: [who, target.pareja] })
        }

        user.pareja = who
        target.pareja = m.sender

        let fecha = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })
        let name1 = await conn.getName(m.sender)
        let name2 = await conn.getName(who)

        let caption = `ᯇ 💒 𝗠𝗔𝗧𝗥𝗜𝗠𝗢𝗡𝗜𝗢 💒 ୧

⤷ ┇ 𝗘𝗟 𝗔𝗠𝗢𝗥 𝗩𝗘𝗡𝗖𝗜𝗢 ：✿ 。

꒰ ◞⁺⊹ ．💖 *¡SE CASARON!* 💖

@${name1} ❤️ @${name2}

──愛 *𝗩𝗢𝗧𝗢𝗦* ╏ 💌
"Prometo amarte en las buenas, en las malas,
y en los días que el wifi falle"

──愛 *𝗗𝗘𝗧𝗔𝗟𝗘𝗦* ╏ 💍
📅 𝗙𝗲𝗰𝗵𝗮: ${fecha}

> *¡Que vivan los novios!* 🎉💕`

        return conn.sendMessage(m.chat, {
            image: { url: IMG_CASAMIENTO },
            caption: caption,
            mentions: [m.sender, who] // AQUI FUERZA EL @AZUL
        }, { quoted: m })
    }

    if (command == 'divorcio' || command == 'divorce') {
        let user = global.db.data.users[m.sender]
        if (!user.pareja) return m.reply(`💔 *No tienes pareja*`)

        let pareja = user.pareja
        user.pareja = null
        global.db.data.users[pareja].pareja = null

        let name1 = await conn.getName(m.sender)
        let name2 = await conn.getName(pareja)

        let caption = `ᯇ 💔 𝗗𝗜𝗩𝗢𝗥𝗖𝗜𝗢 💔 ୧

@${name1} 💔 @${name2}

*Ahora son libres* 🕊️`

        return conn.sendMessage(m.chat, {
            image: { url: IMG_DIVORCIO },
            caption: caption,
            mentions: [m.sender, pareja]
        }, { quoted: m })
    }
}

handler.help = ['marry', 'divorcio']
handler.tags = ['fun']
handler.command = /^(marry|casar|divorcio|divorce)$/i
handler.group = true

export default handler