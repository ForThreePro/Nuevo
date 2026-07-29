let handler = async (m, { conn, participants, usedPrefix, command }) => {
    let mentionedJid = m.mentionedJid && m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : null

    if (!mentionedJid) return conn.reply(m.chat, `╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🚮 *EXPULSAR USUARIO*
│
│ ⚡ *Menciona a un usuario o responde a un mensaje*
╰─────────────────❒`, m)

    try {
        let groupMetadata = await conn.groupMetadata(m.chat)
        let ownerGroup = groupMetadata.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
        let ownerBot = global.owner[0][0] + '@s.whatsapp.net'

        if (mentionedJid === conn.user.jid) return conn.reply(m.chat, `╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ ❌ *ERROR DE SISTEMA*
│
│ ⚡ *No puedo expulsarme a mi mismo*
╰─────────────────❒`, m)
        if (mentionedJid === ownerGroup) return conn.reply(m.chat, `╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ ❌ *ERROR DE SISTEMA*
│
│ ⚡ *No puedo expulsar al creador del grupo*
╰─────────────────❒`, m)
        if (mentionedJid === ownerBot) return conn.reply(m.chat, `╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ ❌ *ERROR DE SISTEMA*
│
│ ⚡ *No puedo expulsar al dueño del bot*
╰─────────────────❒`, m)

        await conn.groupParticipantsUpdate(m.chat, [mentionedJid], 'remove')
        conn.reply(m.chat, `╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🚮 *USUARIO EXPULSADO*
│
│ ⚡ *@${mentionedJid.split('@')[0]} fue sacado del grupo*
│ 💻 *Protocolo de seguridad ejecutado*
╰─────────────────❒`, m, { mentions: [mentionedJid] })
    } catch (e) {
        conn.reply(m.chat, `╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ ❌ *ERROR DE SISTEMA*
│
│ ⚡ *Ocurrió un problema*
│ 🤖 *${e.message}*
╰─────────────────❒`, m)
    }
}

handler.help = ['kick @user']
handler.tags = ['group']
handler.command = ['kick', 'echar', 'hechar', 'sacar', 'ban']
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler