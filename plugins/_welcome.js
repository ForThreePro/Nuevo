let handler = async (m, { conn, usedPrefix, args, isAdmin }) => {
    if (!m.isGroup) return m.reply('⚡ Este comando solo funciona en grupos')
    if (!isAdmin) return global.dfail('admin', m, conn)

    // Auto crear si no existe
    if (!global.db.data.chats[m.chat]) global.db.data.chats[m.chat] = {}
    if (global.db.data.chats[m.chat].welcome == null) global.db.data.chats[m.chat].welcome = true

    if (!args[0]) return m.reply(`╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🛡️ *CONFIG WELCOME*
│
│ 📌 *USO:* ${usedPrefix}welcome on
│ 📌 *USO:* ${usedPrefix}welcome off
│
│ *Estado:* ${global.db.data.chats[m.chat].welcome? 'ACTIVADO ✅' : 'DESACTIVADO ❌'}
╰─────────────────❒`)

    global.db.data.chats[m.chat].welcome = /true|on|1/i.test(args[0])
    let estado = global.db.data.chats[m.chat].welcome? 'ACTIVADO ⚡' : 'DESACTIVADO ❌'

    m.reply(`╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 💻 *SISTEMA ACTUALIZADO*
│
│ 🤖 *Modulo:* Bienvenida
│ 📊 *Estado:* ${estado}
│ 👤 *Admin:* @${m.sender.split('@')[0]}
│
│ > *“Configuracion guardada”*
╰─────────────────❒`, null, { mentions: [m.sender] })
}
handler.command = ['welcome']
handler.group = true
handler.admin = true
export default handler