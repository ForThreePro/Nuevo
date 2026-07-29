let mutedUsers = new Set();

let handler = async (m, { conn, command, participants }) => {
    let mentionedJid = m.mentionedJid[0]? m.mentionedJid[0] : m.quoted? m.quoted.sender : false;
    if (!mentionedJid) return m.reply(`╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ ⚡ *ERROR DE SISTEMA*
│
│ 🚩 *USO:* Responde a un mensaje
│
│ > *“Protocolo de muteo requiere objetivo”* 🤖
╰─────────────────❒`);

    let isUserAdmin = participants.find(p => p.id === mentionedJid)?.admin;
    if (isUserAdmin) return m.reply(`╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🛡️ *ACCESO DENEGADO*
│
│ ⚠️ *No se puede mutear a un administrador*
│
│ > *“Rango superior detectado”* ⚡
╰─────────────────❒`);

    if (mentionedJid === conn.user.jid) return m.reply(`╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🤖 *PROTOCOLO FALLIDO*
│
│ ⚠️ *No puedo realizar esta acción conmigo mismo*
│
│ > *“Autoeliminacion no permitida”* ❌
╰─────────────────❒`);

    if (command === "mute") {
        mutedUsers.add(mentionedJid);
        conn.reply(m.chat, `╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🔇 *USUARIO SILENCIADO*
│
│ 👤 *Objetivo:* @${mentionedJid.split('@')[0]}
│ 📊 *Estado:* MUTE ACTIVADO
│
│ > *“Se eliminaran sus mensajes”* ⚡
╰─────────────────❒`, m, { mentions: [mentionedJid] });
    } else if (command === "unmute") {
        mutedUsers.delete(mentionedJid);
        conn.reply(m.chat, `╭─❒ *『 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🔊 *USUARIO LIBERADO*
│
│ 👤 *Objetivo:* @${mentionedJid.split('@')[0]}
│ 📊 *Estado:* MUTE DESACTIVADO
│
│ > *“Puede volver a escribir”* ⚡
╰─────────────────❒`, m, { mentions: [mentionedJid] });
    }
};

handler.before = async (m, { conn, isAdmin }) => {
    // Si el remitente del mensaje está en la lista de muteados, eliminamos el mensaje
    if (mutedUsers.has(m.sender)) {
        try {
            await conn.sendMessage(m.chat, { delete: m.key });
        } catch (e) {
            console.error(e);
        }
    }
};

handler.help = ['mute', 'unmute'].map(v => v + ' Reacciona Al Mensaje');
handler.tags = ['grupos'];
handler.command = /^(mute|unmute)$/i;
handler.group = true;
handler.admin = true;
handler.botAdmin = true;

export default handler