import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

export async function handler(m, { conn }) {} // dummy para que lo cargue

export async function groupParticipantsUpdate(conn, update) {
    if (!update.participants) return

    const chat = global.db?.data?.chats?.[update.id] || {}
    if (chat.welcome === false) return // si esta apagado, salir

    try {
        const groupMetadata = await conn.groupMetadata(update.id)
        const groupName = groupMetadata.subject
        const groupMembers = groupMetadata.participants.length
        const groupDesc = groupMetadata.desc?.toString() || 'Sin descripción'

        for (let userJid of update.participants) {
            let user = userJid
            if (userJid.endsWith('@lid')) {
                let info = await conn.onWhatsApp(userJid)
                user = info[0]?.jid || userJid
            }
            const tagUser = `@${user.split('@')[0]}`

            // FOTO: USER > GRUPO > LOGO
            let imgBuffer = null
            try {
                let ppUser = await conn.profilePictureUrl(user, 'image').catch(() => null)
                if (ppUser) imgBuffer = Buffer.from(await (await fetch(ppUser, {timeout: 5000})).arrayBuffer())
                if (!imgBuffer) {
                    let ppGroup = await conn.profilePictureUrl(update.id, 'image').catch(() => null)
                    if (ppGroup) imgBuffer = Buffer.from(await (await fetch(ppGroup, {timeout: 5000})).arrayBuffer())
                }
                if (!imgBuffer) {
                    imgBuffer = Buffer.from(await (await fetch('https://files.evogb.win/wX15Ie.jpg', {timeout: 5000})).arrayBuffer())
                }
            } catch {}

            let text = '', audioFile = ''

            if (update.action == 'add') { // ENTRA
                audioFile = './bienvenida.mp3'
                text = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ ⚡ *NUEVO NODO CONECTADO*
│
│ 🤖 *Usuario:* ${tagUser}
│ 💻 *Sistema:* ${groupName}
│ 👥 *Nodos:* ${groupMembers}
│ 📜 *Protocolo:* ${groupDesc}
│
│ > *“Bienvenido al sistema”* 🤖
╰─────────────────❒`
            }
            if (update.action == 'remove') { // LO SACAN
                audioFile = './kick.mp3'
                text = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🚮 *PROTOCOLO DE EXPULSIÓN*
│
│ 💣 *Usuario:* ${tagUser}
│ 🛡️ *Motivo:* Violación de seguridad
│ 💻 *Sistema:* ${groupName}
│
│ > *“Acceso revocado”* ⚡
╰─────────────────❒`
            }
            if (update.action == 'leave') { // SALE SOLO
                audioFile = './despedida.mp3'
                text = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 💨 *NODO DESCONECTADO*
│
│ 🌫️ *Usuario:* ${tagUser}
│ 💻 *Sistema:* ${groupName}
│ 👥 *Nodos:* ${groupMembers}
│
│ > *“Conexión cerrada”* ⚡
╰─────────────────❒`
            }

            if(imgBuffer) {
                await conn.sendMessage(update.id, { image: imgBuffer, caption: text, mentions: [user] })
            } else {
                await conn.sendMessage(update.id, { text: text, mentions: [user] })
            }

            const audioPath = path.resolve(audioFile)
            if (fs.existsSync(audioPath)) {
                await new Promise(r => setTimeout(r, 1500))
                await conn.sendMessage(update.id, {
                    audio: fs.readFileSync(audioPath),
                    mimetype: 'audio/mpeg',
                    ptt: false
                })
            }
        }
    } catch(e) {
        console.log(chalk.red('[WELCOME EVENT ERROR]', e))
    }
}