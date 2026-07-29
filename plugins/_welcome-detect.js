import fetch from 'node-fetch'
import fs from 'fs'
import chalk from 'chalk'

export async function groupParticipantsUpdate(conn, { id, participants, action }) {
    let chat = global.db.data.chats[id]
    if (!chat?.bienvenida) return // Si esta apagado, sale

    try {
        let metadata = await conn.groupMetadata(id)
        let groupName = metadata.subject
        let total = metadata.participants.length

        for (let user of participants) {
            let tag = '@' + user.split('@')[0]

            // 1. SACAR FOTO: USER > GRUPO > DEFAULT
            let pp
            try { pp = await conn.profilePictureUrl(user, 'image') }
            catch {
                try { pp = await conn.profilePictureUrl(id, 'image') }
                catch { pp = 'https://files.evogb.win/wX15Ie.jpg' }
            }

            let txt = '', audio = ''

            if (action == 'add') { // ENTRA
                audio = './bienvenida.mp3'
                txt = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ ⚡ *NUEVO NODO CONECTADO*
│
│ 🤖 *Usuario:* ${tag}
│ 💻 *Sistema:* ${groupName}
│ 👥 *Nodos:* ${total}
│
│ > *“Bienvenido al sistema”* 🤖
╰─────────────────❒`
            }
            if (action == 'leave') { // SALE SOLO
                audio = './despedida.mp3'
                txt = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 💨 *NODO DESCONECTADO*
│
│ 🌫️ *Usuario:* ${tag}
│ 💻 *Sistema:* ${groupName}
│ 👥 *Nodos:* ${total}
│
│ > *“Conexión cerrada”* ⚡
╰─────────────────❒`
            }
            if (action == 'remove') { // LO SACAN
                audio = './kick.mp3'
                txt = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🚮 *PROTOCOLO DE EXPULSIÓN*
│
│ 💣 *Usuario:* ${tag}
│ 🛡️ *Sistema:* ${groupName}
│
│ > *“Acceso revocado”* ⚡
╰─────────────────❒`
            }

            // ENVIAR IMAGEN + TEXTO
            await conn.sendMessage(id, { image: { url: pp }, caption: txt, mentions: [user] })

            // ENVIAR AUDIO 1 SEG DESPUES
            if (fs.existsSync(audio)) {
                await new Promise(r => setTimeout(r, 1000))
                await conn.sendMessage(id, { audio: fs.readFileSync(audio), mimetype: 'audio/mpeg', ptt: false })
            }
        }
    } catch(e) { console.log(chalk.red(e)) }
}