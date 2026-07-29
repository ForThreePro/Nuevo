import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

// FUNCION PARA CREAR LA DB SI NO EXISTE
const getChat = (chatId) => {
    if (!global.db.data.chats[chatId]) {
        global.db.data.chats[chatId] = {
            welcome: true, // viene activado por defecto
            detect: true
        }
    }
    return global.db.data.chats[chatId]
}

let handler = async (m, { conn, usedPrefix, args, isAdmin }) => {
    if (!m.isGroup) return m.reply('⚡ Este comando solo funciona en grupos')
    if (!isAdmin) return global.dfail('admin', m, conn)

    let chat = getChat(m.chat) // [FIX] SE CREA SOLO SI NO EXISTE

    if (!args[0]) return m.reply(`╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🛡️ *CONFIG WELCOME*
│
│ 📌 *USO:* ${usedPrefix}welcome on
│ 📌 *USO:* ${usedPrefix}welcome off
│
│ *Estado:* ${chat.welcome? 'ACTIVADO ✅' : 'DESACTIVADO ❌'}
╰─────────────────❒`)

    let isEnable = /true|enable|(turn)?on|1/i.test(args[0])
    chat.welcome = isEnable

    let estado = isEnable? 'ACTIVADO ⚡' : 'DESACTIVADO ❌'
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

handler.help = ['welcome on/off']
handler.tags = ['config']
handler.command = ['welcome']
handler.group = true
handler.admin = true
export default handler

// DETECTOR DE ENTRADAS PARA MOONLIGHT
export async function all(m, { conn }) {
    if (!m.isGroup ||!m.messageStubType) return

    let chat = getChat(m.chat) // [FIX] SE CREA SOLO SI NO EXISTE
    if (chat.welcome === false) return

    let userJid = m.messageStubParameters?.[0]
    if (!userJid) return

    try {
        const groupMetadata = await conn.groupMetadata(m.chat)
        let user = userJid
        if (userJid.endsWith('@lid')) {
            let info = await conn.onWhatsApp(userJid)
            user = info[0]?.jid || userJid
        }
        const tagUser = `@${user.split('@')[0]}`
        const groupName = groupMetadata.subject
        const groupMembers = groupMetadata.participants.length
        const groupDesc = groupMetadata.desc?.toString() || 'Sin descripción'

        // FOTO: USER > GRUPO > LOGO
        let imgBuffer = null
        try {
            let ppUser = await conn.profilePictureUrl(user, 'image').catch(() => null)
            if (ppUser) imgBuffer = Buffer.from(await (await fetch(ppUser, {timeout: 5000})).arrayBuffer())
            if (!imgBuffer) {
                let ppGroup = await conn.profilePictureUrl(m.chat, 'image').catch(() => null)
                if (ppGroup) imgBuffer = Buffer.from(await (await fetch(ppGroup, {timeout: 5000})).arrayBuffer())
            }
            if (!imgBuffer) {
                imgBuffer = Buffer.from(await (await fetch('https://files.evogb.win/wX15Ie.jpg', {timeout: 5000})).arrayBuffer())
            }
        } catch {}

        let text = '', audioFile = ''

        if (m.messageStubType == 27) { // ADD
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
        if (m.messageStubType == 28) { // LEAVE
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
        if (m.messageStubType == 29) { // KICK
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
        if(!text) return

        if(imgBuffer) {
            await conn.sendMessage(m.chat, { image: imgBuffer, caption: text, mentions: [user] })
        } else {
            await conn.sendMessage(m.chat, { text: text, mentions: [user] })
        }

        const audioPath = path.resolve(audioFile)
        if (fs.existsSync(audioPath)) {
            await new Promise(r => setTimeout(r, 1500))
            await conn.sendMessage(m.chat, {
                audio: fs.readFileSync(audioPath),
                mimetype: 'audio/mpeg',
                ptt: false
            })
        }
    } catch(e) {
        console.log(chalk.red('[WELCOME ERROR]', e))
    }
}