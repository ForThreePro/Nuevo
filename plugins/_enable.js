import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

let handler = async (m, { conn, usedPrefix, command, args, isAdmin }) => {
    if (!m.isGroup) return m.reply('⚡ Este comando solo funciona en grupos')
    if (!isAdmin) return global.dfail('admin', m, conn)

    if (!args[0]) return m.reply(`╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🛡️ *ERROR DE SISTEMA*
│
│ 📌 *USO:* ${usedPrefix + command} on
│ 📌 *USO:* ${usedPrefix + command} off
│
│ > *“Ingresa un parametro valido”* 🤖
╰─────────────────❒`)

    let isEnable = /true|enable|(turn)?on|1/i.test(args[0])
    let chat = global.db.data.chats[m.chat]
    let type = command.toLowerCase()
    let name = ''

    switch (type) {
        case 'welcome':
            chat.welcome = isEnable
            name = 'SISTEMA DE BIENVENIDA'
            break
        case 'detect':
            chat.detect = isEnable
            name = 'DETECTOR DE CAMBIOS'
            break
        default:
            return m.reply('⚡ Opcion no valida. Usa: welcome o detect')
    }

    // IMAGEN DEL RAYO
    const pathImg = join(process.cwd(), 'storage', 'img', 'rayo.jpg')
    let rayoImg
    if (existsSync(pathImg)) {
        rayoImg = readFileSync(pathImg)
    } else {
        rayoImg = { url: 'https://files.catbox.moe/t7uytz.png' }
    }

    let estadoTexto = isEnable? 'ACTIVADO ⚡' : 'DESACTIVADO ❌'
    let estadoEmoji = isEnable? '✅' : '❌'

    let statusTxt = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 💻 *REGISTRO DEL SISTEMA*
│
│ 🤖 *MODULO:* ${name}
│ 📊 *ESTADO:* ${estadoTexto} ${estadoEmoji}
│ 👤 *ADMIN:* @${m.sender.split('@')[0]}
│
│ > *“Configuracion actualizada correctamente”* ⚡
╰─────────────────❒`

    await conn.sendMessage(m.chat, {
        image: rayoImg.byteLength? rayoImg : { url: rayoImg.url },
        caption: statusTxt,
        mentions: [m.sender]
    }, { quoted: m })
}

handler.help = ['welcome on/off', 'detect on/off']
handler.tags = ['config']
handler.command = ['welcome', 'detect']
handler.group = true
handler.admin = true
handler.botAdmin = false

export default handler