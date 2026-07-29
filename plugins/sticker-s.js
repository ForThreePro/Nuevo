import { sticker } from '../lib/sticker.js'

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || q.mediaType || ''
    if (!/webp|image|video/g.test(mime)) return m.reply(`╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🎭 *STICKER*
│
│ ⚠️ *Responde a una imagen, video o gif*
│ 💻 *Para convertirlo en sticker*
╰─────────────────❒`)

    let img = await q.download()
    let stiker = await sticker(img, false, 'Cyber Bot', 'Whois Yallico')

    await conn.sendFile(m.chat, stiker, 'sticker.webp', `╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ ⚡ *STICKER CREADO*
│
│ > *El sistema en forma de sticker*
╰─────────────────❒`, m)
}

handler.help = ['s']
handler.tags = ['sticker']
handler.command = ['s', 'sticker', 'stiker']

export default handler