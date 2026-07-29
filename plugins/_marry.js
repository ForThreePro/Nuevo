let handler = async (m, { conn, usedPrefix, command }) => {
    let who = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : null

    // ===== IMAGENES POR DEFECTO =====
    // Boda: Pareja aesthetic
    const IMG_CASAMIENTO = 'https://files.evogb.win/zu9HrE.jpg'
    // Divorcio: Corazon roto
    const IMG_DIVORCIO = 'https://files.evogb.win/bftECK.jpg'

    global.db.data.users[m.sender] = global.db.data.users[m.sender] || { pareja: null }

    // Función para enviar imagen
    const sendMedia = async (chat, url, caption, mentions) => {
        return conn.sendMessage(chat, {
            image: { url: url },
            caption: caption,
            mentions: mentions
        }, { quoted: m })
    }

    // ===== CASARSE =====
    if (command == 'marry' || command == 'casar') {
        if (!who) return m.reply(`💍 *Uso:* ${usedPrefix}marry @usuario\n*Etiqueta a alguien para proponerle*`)
        if (who === m.sender) return m.reply('🙄 *No te puedes casar contigo mismo xd*')

        global.db.data.users[who] = global.db.data.users[who] || { pareja: null }
        let user = global.db.data.users[m.sender]
        let target = global.db.data.users[who]

        if (user.pareja) return m.reply(`💍 *Ya estás casado con @${user.pareja.split('@')[0]}*\n*Usa ${usedPrefix}divorcio primero*`, null, { mentions: [user.pareja] })
        if (target.pareja) return m.reply(`💔 *@${who.split('@')[0]} ya tiene pareja*`, null, { mentions: [who] })

        // Casarlos
        user.pareja = who
        target.pareja = m.sender

        let fecha = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })

        let caption = `ᯇ 💒 𝗠𝗔𝗧𝗥𝗜𝗠𝗢𝗡𝗜𝗢 💒 ୧

⤷ ┇ 𝗘𝗟 𝗔𝗠𝗢𝗥 𝗩𝗘𝗡𝗖𝗜𝗢 ：✿ 。

꒰ ◞⁺⊹ ．💖 *¡SE CASARON!* 💖

@${m.sender.split('@')[0]} ❤️ @${who.split('@')[0]}

──愛 *𝗩𝗢𝗧𝗢𝗦* ╏ 💌
"Prometo amarte en las buenas, en las malas,
y en los días que el wifi falle"

──愛 *𝗗𝗘𝗧𝗔𝗟𝗘𝗦* ╏ 💍
📅 𝗙𝗲𝗰𝗵𝗮: ${fecha}
💬 *Que su amor dure más que la batería del cel*

> *¡Que vivan los novios!* 🎉💕`

        return sendMedia(m.chat, IMG_CASAMIENTO, caption, [m.sender, who])
    }

    // ===== DIVORCIARSE =====
    if (command == 'divorcio' || command == 'divorce') {
        let user = global.db.data.users[m.sender]
        if (!user.pareja) return m.reply(`💔 *No tienes pareja*\n*Usa ${usedPrefix}marry @usuario*`)

        let pareja = user.pareja
        if (global.db.data.users[pareja].pareja!== m.sender) return m.reply(`⚠️ *Error en la DB*`)

        // Divorcio
        user.pareja = null
        global.db.data.users[pareja].pareja = null

        let caption = `ᯇ 💔 𝗗𝗜𝗩𝗢𝗥𝗖𝗜𝗢 💔 ୧

⤷ ┇ 𝗙𝗜𝗡𝗔𝗟 𝗗𝗘𝗟 𝗔𝗠𝗢𝗥 ：✿ 。

꒰ ◞⁺⊹ ．😭 *SE ACABÓ* 😭

@${m.sender.split('@')[0]} 💔 @${pareja.split('@')[0]}

──愛 *𝗖𝗔𝗥𝗧𝗔* ╏ 💌
"Ya no fue... pero gracias por los memes"
"El amor es como el internet: a veces se cae"

──愛 *𝗗𝗘𝗧𝗔𝗟𝗘𝗦* ╏ 📝
*División de bienes:* El que llore último paga el wifi

> *Ahora son libres* 🕊️ *A rehacer su vida*`

        return sendMedia(m.chat, IMG_DIVORCIO, caption, [m.sender, pareja])
    }
}

handler.help = ['marry @usuario', 'divorcio']
handler.tags = ['fun']
handler.command = /^(marry|casar|divorcio|divorce)$/i
handler.group = true

export default handler