let handler = async (m, { conn, usedPrefix, command }) => {
    // PRIORIDAD 1: Mencion real
    let who = m.mentionedJid?.[0]
    // PRIORIDAD 2: Responder mensaje
    if (!who && m.quoted) who = m.quoted.sender

    const IMG_CASAMIENTO = 'https://files.evogb.win/zu9HrE.jpg'
    const IMG_DIVORCIO = 'https://files.evogb.win/bftECK.jpg'

    global.db.data.users[m.sender] = global.db.data.users[m.sender] || { pareja: null }

    const sendMedia = async (chat, url, caption, mentions) => {
        return conn.sendMessage(chat, {
            image: { url: url },
            caption: caption,
            mentions: mentions
        }, { quoted: m })
    }

    if (command == 'marry' || command == 'casar') {
        if (!who) return m.reply(`💍 *Uso CORRECTO:* ${usedPrefix}marry\n*1. Escribe.marry*\n*2. Toca @ y selecciona a la persona*\n\n*O responde al mensaje de la persona +.marry*`)
        if (who === m.sender) return m.reply('🙄 *No te puedes casar contigo mismo xd*')

        global.db.data.users[who] = global.db.data.users[who] || { pareja: null }
        let user = global.db.data.users[m.sender]
        let target = global.db.data.users[who]

        if (user.pareja) {
            let ex = await conn.getName(user.pareja)
            return m.reply(`💍 *Ya estás casado con @${ex}*`, null, { mentions: [user.pareja] })
        }
        if (target.pareja) {
            let nameTarget = await conn.getName(who)
            let ex2 = await conn.getName(target.pareja)
            return m.reply(`💔 *@${nameTarget} ya tiene pareja con @${ex2}*`, null, { mentions: [who, target.pareja] })
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

        return sendMedia(m.chat, IMG_CASAMIENTO, caption, [m.sender, who])
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

        return sendMedia(m.chat, IMG_DIVORCIO, caption, [m.sender, pareja])
    }
}

handler.help = ['marry @usuario', 'divorcio']
handler.tags = ['fun']
handler.command = /^(marry|casar|divorcio|divorce)$/i
handler.group = true

export default handler