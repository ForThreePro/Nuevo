import chalk from 'chalk'
import { WAMessageStubType } from '@whiskeysockets/baileys'

let handler = m => m

handler.before = async function (m, { conn, groupMetadata }) {
    if (!m.messageStubType ||!m.isGroup) return

    let chat = global.db.data.chats[m.chat]
    if (!chat?.detect) return

    const userJid = m.sender
    const usuario = `@${userJid.split('@')[0]}`
    const group = groupMetadata.subject

    let txt = ''

    switch (m.messageStubType) {
        case 21: // Cambiar nombre
            txt = `╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ ⚡ *REGISTRO DEL SISTEMA*
│
│ 📢 *CAMBIO DE NOMBRE*
│ 👤 *Usuario:* ${usuario}
│ 📝 *Nuevo:* _${m.messageStubParameters[0]}_
│ 💻 *Grupo:* ${group}
│
│ > *“Sistema renombrado correctamente”* 🤖
╰─────────────────❒`; break

        case 22: // Cambiar foto
            txt = `╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ ⚡ *REGISTRO DEL SISTEMA*
│
│ 📸 *CAMBIO DE FOTO*
│ 👤 *Usuario:* ${usuario}
│ 🖼️ *Nueva imagen establecida*
│ 💻 *Grupo:* ${group}
│
│ > *“Imagen actualizada en el sistema”* 🤖
╰─────────────────❒`; break

        case 23: // Cambiar link
            txt = `╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🛡️ *ALERTA DE SEGURIDAD*
│
│ 🔗 *LINK RESETEADO*
│ 👤 *Usuario:* ${usuario}
│ 💻 *Grupo:* ${group}
│
│ > *“Protocolo de enlace modificado”* ⚡
╰─────────────────❒`; break

        case 25: // Cambiar ajustes
            txt = `╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🛡️ *AJUSTES MODIFICADOS*
│
│ 👤 *Usuario:* ${usuario}
│ ⚙️ *Permisos:* ${m.messageStubParameters[0] == 'on'? '*SOLO ADMINS* 🔒' : '*TODOS* 🔓'}
│ 📊 *Edición de info de grupo*
│
│ > *“Permisos del sistema actualizados”* ⚡
╰─────────────────❒`; break

        case 26: // Abrir/Cerrar
            txt = `╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 💻 *ESTADO DEL SISTEMA*
│
│ 👤 *Usuario:* ${usuario}
│ 🗣️ *Modo:* ${m.messageStubParameters[0] == 'on'? '*SOLO ADMINS* 🔒' : '*TODOS* 🔓'}
│ 📢 *Grupo:* ${m.messageStubParameters[0] == 'on'? 'CERRADO' : 'ABIERTO'}
│
│ > *“Modo de comunicación actualizado”* 🤖
╰─────────────────❒`; break

        case 29: // Dar admin
            txt = `╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 👑 *ASCENSO DE RANGO*
│
│ ⚡ *Nuevo Admin:* @${m.messageStubParameters[0].split('@')[0]}
│ 👤 *Otorgado por:* ${usuario}
│ 💻 *Rango:* Administrador
│
│ > *“Acceso de administrador concedido”* ⚡
╰─────────────────❒`; break

        case 30: // Quitar admin
            txt = `╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 📉 *RANGO REVOCADO*
│
│ 💥 *Admin removido:* @${m.messageStubParameters[0].split('@')[0]}
│ 👤 *Ejecutado por:* ${usuario}
│ 🗑️ *Permisos eliminados*
│
│ > *“Acceso de administrador revocado”* ⚡
╰─────────────────❒`; break

        // ELIMINADOS: WELCOME / BYE / KICK
        // case WAMessageStubType.GROUP_PARTICIPANT_ADD:
        // case WAMessageStubType.GROUP_PARTICIPANT_LEAVE:
        // case WAMessageStubType.GROUP_PARTICIPANT_REMOVE:
    }

    if (txt) {
        await this.sendMessage(m.chat, {
            text: txt,
            mentions: [userJid,...(m.messageStubParameters?.[0]? [m.messageStubParameters[0]] : [])]
        })
    }
}

export default handler