import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

let handler = async (m, { conn, usedPrefix, args, isAdmin }) => {
    if (!m.isGroup) return m.reply('⚡ Este comando solo funciona en grupos')
    if (!isAdmin) return global.dfail('admin', m, conn)

    if (!args[0]) return m.reply(`╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🛡️ *CONFIG WELCOME*
│
│ 📌 *USO:* ${usedPrefix}welcome on
│ 📌 *USO:* ${usedPrefix}welcome off
│
│ *Estado:* ${global.db.data.chats[m.chat].welcome? 'ACTIVADO ✅' : 'DESACTIVADO ❌'}
╰─────────────────❒`)

    let isEnable = /true|enable|(turn)?on|1/i.test(args[0])
    global.db.data.chats[m.chat].welcome = isEnable

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

export async function before(m, { conn }) {
  if (!m.messageStubType ||!m.isGroup) return true;

  const chat = global.db?.data?.chats?.[m.chat];
  if (!chat || chat.welcome === false) return true;

  try {
    const groupMetadata = await conn.groupMetadata(m.chat).catch(() => null);
    if (!groupMetadata) return true;

    let userJid = m.messageStubParameters?.[0];
    if (!userJid) return true;

    let user = userJid;
    if (userJid.endsWith('@lid')) {
      try {
        let info = await conn.onWhatsApp(userJid);
        user = info[0]?.jid || userJid;
      } catch {}
    }
    const tagUser = `@${user.split('@')[0]}`;

    const groupName = groupMetadata.subject || 'Cyber System';
    const groupMembers = groupMetadata.participants.length;

    // [FIX NUEVO] PRIORIDAD: FOTO USER > FOTO GRUPO > LOGO
    let imgBuffer = null;
    try {
      // 1. INTENTAR FOTO DEL USUARIO
      let ppUser = await conn.profilePictureUrl(user, 'image').catch(() => null);
      if (ppUser) {
        let res = await fetch(ppUser, { timeout: 5000 }).catch(() => null);
        if (res && res.ok) imgBuffer = Buffer.from(await res.arrayBuffer());
      }

      // 2. SI NO TIENE, INTENTAR FOTO DEL GRUPO
      if (!imgBuffer) {
        let ppGroup = await conn.profilePictureUrl(m.chat, 'image').catch(() => null);
        if (ppGroup) {
          let res = await fetch(ppGroup, { timeout: 5000 }).catch(() => null);
          if (res && res.ok) imgBuffer = Buffer.from(await res.arrayBuffer());
        }
      }

      // 3. SI NO HAY, LOGO DEFAULT
      if (!imgBuffer) {
        let res = await fetch('https://files.evogb.win/wX15Ie.jpg', { timeout: 5000 });
        imgBuffer = Buffer.from(await res.arrayBuffer());
      }
    } catch {
      imgBuffer = null;
    }

    let text = '', audioFile = '';

    switch (m.messageStubType) {
      case 27: // ADD
        audioFile = './bienvenida.mp3';
        text = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ ⚡ *NUEVO NODO CONECTADO*
│
│ 🤖 *Usuario:* ${tagUser}
│ 💻 *Sistema:* ${groupName}
│ 👥 *Nodos:* ${groupMembers}
│
│ > *“Bienvenido al sistema”* 🤖
╰─────────────────❒`;
        break;

      case 28: // LEAVE
        audioFile = './despedida.mp3';
        text = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 💨 *NODO DESCONECTADO*
│
│ 🌫️ *Usuario:* ${tagUser}
│ 💻 *Sistema:* ${groupName}
│ 👥 *Nodos:* ${groupMembers}
│
│ > *“Conexión cerrada”* ⚡
╰─────────────────❒`;
        break;

      case 29: // KICK
        audioFile = './kick.mp3';
        text = `╭─❒ *『 ⚡ 𝗖𝗬𝗕𝗘𝗥 𝗕𝗢𝗧 』* ❒
│ 🚮 *PROTOCOLO DE EXPULSIÓN*
│
│ 💣 *Usuario:* ${tagUser}
│ 🛡️ *Motivo:* Violación de seguridad
│ 💻 *Sistema:* ${groupName}
│
│ > *“Acceso revocado”* ⚡
╰─────────────────❒`;
        break;

      default: return true;
    }

    if(imgBuffer){
      await conn.sendMessage(m.chat, { image: imgBuffer, caption: text, mentions: [user] }).catch(() => {});
    } else {
      await conn.sendMessage(m.chat, { text: text, mentions: [user] }).catch(() => {});
    }

    const audioPath = path.resolve(audioFile);
    if (fs.existsSync(audioPath)) {
      await new Promise(r => setTimeout(r, 1500));
      await conn.sendMessage(m.chat, {
        audio: fs.readFileSync(audioPath),
        mimetype: 'audio/mpeg',
        ptt: false
      }).catch(() => {});
    }

  } catch (e) {
    console.log(chalk.red('[WELCOME ERROR]', e));
  }
  return true;
}

export default handler