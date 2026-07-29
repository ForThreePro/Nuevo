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
    let log = ''

    switch (m.messageStubType) {
        case WAMessageStubType.GROUP_CHANGE_SUBJECT: // 21
            txt = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 💻 *REGISTRO DEL SISTEMA*
│
│ 📝 *CAMBIO DE NOMBRE*
│ 👤 *Usuario:* ${usuario}
│ 🆕 *Nuevo:* _${m.messageStubParameters[0]}_
│ 🏷️ *Grupo:* ${group}
│
│ > *“Protocolo de nombre actualizado”* 🤖
╰─────────────────❒`
            log = chalk.yellow(`[DETECT] Nombre cambiado por ${userJid.split('@')[0]} → ${m.messageStubParameters[0]}`)
            break

        case WAMessageStubType.GROUP_CHANGE_ICON: // 22
            txt = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 💻 *REGISTRO DEL SISTEMA*
│
│ 📸 *CAMBIO DE FOTO*
│ 👤 *Usuario:* ${usuario}
│ 🖼️ *Imagen actualizada*
│ 🏷️ *Grupo:* ${group}
│
│ > *“Identidad visual modificada”* 🤖
╰─────────────────❒`
            log = chalk.cyan(`[DETECT] Foto cambiada por ${userJid.split('@')[0]}`)
            break

        case WAMessageStubType.GROUP_CHANGE_INVITE_LINK: // 23
            txt = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🛡️ *ALERTA DE SEGURIDAD*
│
│ 🔗 *LINK RESETEADO*
│ 👤 *Usuario:* ${usuario}
│ 🏷️ *Grupo:* ${group}
│
│ > *“Protocolo de enlace modificado”* ⚡
╰─────────────────❒`
            log = chalk.red(`[DETECT] Link reseteado por ${userJid.split('@')[0]}`)
            break

        case WAMessageStubType.GROUP_CHANGE_DESCRIPTION: // 24
            txt = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 💻 *REGISTRO DEL SISTEMA*
│
│ 📜 *DESCRIPCIÓN MODIFICADA*
│ 👤 *Usuario:* ${usuario}
│ 🏷️ *Grupo:* ${group}
│
│ > *“Información del grupo actualizada”* 🤖
╰─────────────────❒`
            log = chalk.green(`[DETECT] Descripción cambiada por ${userJid.split('@')[0]}`)
            break

        case WAMessageStubType.GROUP_CHANGE_ANNOUNCE: // 25
            txt = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🛡️ *AJUSTES MODIFICADOS*
│
│ 👤 *Usuario:* ${usuario}
│ ⚙️ *Modo Edición:* ${m.messageStubParameters[0] == 'on'? '*SOLO ADMINS* 🔒' : '*TODOS* 🔓'}
│ 🏷️ *Grupo:* ${group}
│
│ > *“Permisos del sistema actualizados”* ⚡
╰─────────────────❒`
            log = chalk.magenta(`[DETECT] Modo edición: ${m.messageStubParameters[0]} por ${userJid.split('@')[0]}`)
            break

        case WAMessageStubType.GROUP_CHANGE_RESTRICT: // 26
            txt = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 💻 *ESTADO DEL SISTEMA*
│
│ 👤 *Usuario:* ${usuario}
│ 🗣️ *Mensajes:* ${m.messageStubParameters[0] == 'on'? '*SOLO ADMINS* 🔒' : '*TODOS* 🔓'}
│ 📢 *Estado:* ${m.messageStubParameters[0] == 'on'? 'CERRADO' : 'ABIERTO'}
│
│ > *“Canal de comunicación actualizado”* 🤖
╰─────────────────❒`
            log = chalk.blue(`[DETECT] Modo mensajes: ${m.messageStubParameters[0]} por ${userJid.split('@')[0]}`)
            break

        case WAMessageStubType.GROUP_MEMBER_ADD: // 29
            if (m.messageStubParameters[0] == userJid) return // Ignora si se dio admin a si mismo en add
            txt = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 👑 *ASCENSO DE RANGO*
│
│ ⚡ *Nuevo Admin:* @${m.messageStubParameters[0].split('@')[0]}
│ 👤 *Otorgado por:* ${usuario}
│ 🛡️ *Rango:* Administrador
│
│ > *“Acceso de administrador concedido”* ⚡
╰─────────────────❒`
            log = chalk.greenBright(`[DETECT] Admin dado a ${m.messageStubParameters[0].split('@')[0]} por ${userJid.split('@')[0]}`)
            break

        case WAMessageStubType.GROUP_MEMBER_REMOVE: // 30
            txt = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 📉 *RANGO REVOCADO*
│
│ 💥 *Admin removido:* @${m.messageStubParameters[0].split('@')[0]}
│ 👤 *Ejecutado por:* ${usuario}
│ 🗑️ *Permisos eliminados*
│
│ > *“Acceso de administrador revocado”* ⚡
╰─────────────────❒`
            log = chalk.redBright(`[DETECT] Admin quitado a ${m.messageStubParameters[0].split('@')[0]} por ${userJid.split('@')[0]}`)
            break
    }

    if (txt) {
        console.log(log) // Log en consola
        await this.sendMessage(m.chat, {
            text: txt,
            mentions: [userJid,...(m.messageStubParameters?.[0]? [m.messageStubParameters[0]] : [])]
        })
    }
}

export default handler