import fetch from "node-fetch"
import FormData from "form-data"
import crypto from "crypto"

const MARCA = 'Cyber Bot ⚡' // <- TU MARCA

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const key = Buffer.from('c2FzdWtl', 'base64').toString('utf-8')
    let q = m.quoted? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    let urlTarget = text? text.trim() : ''

    if (!urlTarget &&!/image\/(jpe?g|png)/.test(mime)) {
        return conn.reply(m.chat, `╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ ⚡ *HD UPSCALER AI*
│
│ 🤖 *Uso correcto:*
│ Responde a una imagen o envía
│ un link con: *${usedPrefix + command}*
│
│ 🖼️ *Formatos:* JPG / PNG
│ ⚡ *Procesado con IA*
╰─────────────────❒`, m)
    }

    await m.react('⏳')
    try {
        let finalUrl = urlTarget

        if (!finalUrl && /image\/(jpe?g|png)/.test(mime)) {
            let imgBuffer = await q.download()
            let ext = mime.split('/')[1] || 'jpg'
            let filename = 'media-' + crypto.randomBytes(8).toString('hex') + '.' + ext

            let formulario = new FormData()
            formulario.append('file', imgBuffer, { filename, contentType: mime })

            let resUpload = await fetch(`https://api.evogb.org/tools/upload?key=${key}`, {
                method: 'POST',
                body: formulario,
                headers: {
                   ...formulario.getHeaders(),
                    'User-Agent': 'Mozilla/5.0'
                }
            })
            let jsonUpload = await resUpload.json()
            if (jsonUpload.status && jsonUpload.url) {
                finalUrl = jsonUpload.url
            } else {
                await m.react('❌')
                return m.reply(`╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ ❌ *ERROR DE SISTEMA*
│
│ 🔴 *No se pudo subir la imagen*
│ ⚡ *Motivo:* ${jsonUpload?.message || 'Sin respuesta'}
╰─────────────────❒`)
            }
        }

        let resDl = await fetch(`https://api.evogb.org/tools/upscale?method=url&url=${encodeURIComponent(finalUrl)}&key=${key}`)
        let contentType = resDl.headers.get("content-type")

        if (contentType && contentType.includes("application/json")) {
            let jsonDl = await resDl.json()
            await m.react('❌')
            return m.reply(`╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ ❌ *ERROR DE API*
│
│ ⚡ *${jsonDl.message || 'No se pudo mejorar la imagen.'}*
╰─────────────────❒`)
        }

        let buffer = await resDl.buffer()
        let info = `╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ ✨ *IMAGEN MEJORADA*
│
│ 🤖 *Estado:* Procesado con IA
│ ⚡ *Comando:* ${command.toUpperCase()}
│ 👑 *Bot:* Cyber Bot
│ 🔌 *API:* evogb.org
│
│ > *“Resolución optimizada al 4K”*
╰─────────────────❒`

        await conn.sendMessage(m.chat, { image: buffer, caption: info }, { quoted: m })
        await m.react('✅')

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ ⚠️ *ERROR DE SISTEMA*
│
│ ⚡ *Servidores saturados o error*
│ 🤖 *Intenta de nuevo en unos seg*
╰─────────────────❒`)
    }
}

handler.help = ['upscale', 'remini']
handler.tags = ['tools']
handler.command = /^(upscale|remini|hd|mejorar)$/i

export default handler