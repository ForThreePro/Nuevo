import {WAMessageStubType} from '@whiskeysockets/baileys'
import fetch from 'node-fetch'
import fs from 'fs'

export async function before(m, {conn, participants, groupMetadata}) {
  if (!m.messageStubType ||!m.isGroup) return!0;

  let chat = global.db.data.chats[m.chat]
  if (!chat.welcome) return // lee tu.on welcome

  let user = m.messageStubParameters[0]
  let pp
  try {
    pp = await conn.profilePictureUrl(user, 'image')
  } catch {
    try {
      pp = await conn.profilePictureUrl(m.chat, 'image')
    } catch {
      pp = 'https://files.evogb.win/wX15Ie.jpg'
    }
  }

  let img = await (await fetch(pp)).buffer()
  let tag = '@' + user.split('@')[0]
  let name = groupMetadata.subject
  let total = groupMetadata.participants.length

  let fake = {
    key: { fromMe: false, participant: `0@s.whatsapp.net` },
    message: { "audioMessage": { "mimetype":"audio/ogg; codecs=opus", "seconds": "1", "ptt": "true" }}
  }

  // 27 = ENTRA
  if (m.messageStubType == 27) {
    let welcome = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ ⚡ *NUEVO NODO CONECTADO*
│
│ 🤖 *Usuario:* ${tag}
│ 💻 *Sistema:* ${name}
│ 👥 *Nodos:* ${total}
│
│ > *“Bienvenido al sistema”* 🤖
╰─────────────────❒`

    await conn.sendMessage(m.chat, { image: img, caption: welcome, mentions: [user] })

    // AUDIO
    if (fs.existsSync('./bienvenida.mp3')) {
      await new Promise(r => setTimeout(r, 1000))
      await conn.sendMessage(m.chat, { audio: fs.readFileSync('./bienvenida.mp3'), mimetype: 'audio/mpeg', ptt: false })
    }
  }

  // 28 = SALE SOLO
  if (m.messageStubType == 28) {
    let bye = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 💨 *NODO DESCONECTADO*
│
│ 🌫️ *Usuario:* ${tag}
│ 💻 *Sistema:* ${name}
│ 👥 *Nodos:* ${total}
│
│ > *“Conexión cerrada”* ⚡
╰─────────────────❒`

    await conn.sendMessage(m.chat, { image: img, caption: bye, mentions: [user] })

    if (fs.existsSync('./despedida.mp3')) {
      await new Promise(r => setTimeout(r, 1000))
      await conn.sendMessage(m.chat, { audio: fs.readFileSync('./despedida.mp3'), mimetype: 'audio/mpeg', ptt: false })
    }
  }

  // 32 = KICK
  if (m.messageStubType == 32) {
    let kick = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🚮 *PROTOCOLO DE EXPULSIÓN*
│
│ 💣 *Usuario:* ${tag}
│ 🛡️ *Sistema:* ${name}
│
│ > *“Acceso revocado”* ⚡
╰─────────────────❒`

    await conn.sendMessage(m.chat, { image: img, caption: kick, mentions: [user] })

    if (fs.existsSync('./kick.mp3')) {
      await new Promise(r => setTimeout(r, 1000))
      await conn.sendMessage(m.chat, { audio: fs.readFileSync('./kick.mp3'), mimetype: 'audio/mpeg', ptt: false })
    }
  }
}