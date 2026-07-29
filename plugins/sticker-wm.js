import { addExif } from '../lib/sticker.js'

let handler = async (m, { conn, text }) => {
  if (!m.quoted) return conn.reply(m.chat, `💻 *CYBER BOT* ➔ Responde a un *sticker* para robarlo.`, m) // Cambiado
  let stiker = false
  try {
    let [packname, ...author] = text.split('|')
    author = (author || []).join('|')
    let mime = m.quoted.mimetype || ''
    if (!/webp/.test(mime)) return conn.reply(m.chat, `💻 *CYBER BOT* ➔ Eso no es un *sticker*. Responde a un sticker.`, m) // Cambiado
    let img = await m.quoted.download()
    if (!img) return conn.reply(m.chat, `💻 *CYBER BOT* ➔ No pude descargar el *sticker*.`, m) // Cambiado
    stiker = await addExif(img, packname || 'Cyber Bot', author || 'Whois Yallico') // Cambiado: marca por defecto
  } catch (e) {
    console.error(e)
    if (Buffer.isBuffer(e)) stiker = e
  } finally {
    if (stiker) conn.sendFile(m.chat, stiker, 'wm.webp', '💻 *Cyber Bot* | Sticker reclamado', m) // Cambiado caption
    else return conn.reply(m.chat, `💻 *CYBER BOT* ➔ Error al procesar el *sticker*.`, m) // Cambiado
  }
}
handler.help = ['wm <nombre>|<autor>']
handler.tags = ['sticker']
handler.command = ['take', 'robar', 'wm'] 

export default handler