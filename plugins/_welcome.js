import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk'; // [FIX 1] Faltaba esto

export async function before(m, { conn }) {
  if (!m.messageStubType ||!m.isGroup) return true;

  const chat = global.db?.data?.chats?.[m.chat];
  if (!chat) return true;

  try {
    const groupMetadata = await conn.groupMetadata(m.chat);
    let userJid = m.messageStubParameters?.[0];
    if (!userJid) return true;

    // [FIX @lid]
    let user = userJid;
    if (userJid.endsWith('@lid')) {
      let info = await conn.onWhatsApp(userJid);
      user = info[0]?.jid || userJid;
    }
    const tagUser = `@${user.split('@')[0]}`;

    const groupName = groupMetadata.subject;
    const groupMembers = groupMetadata.participants.length;

    // IMAGEN: FOTO USER O LOGO
    let imgBuffer = null;
    try {
      let ppUrl = await conn.profilePictureUrl(user, 'image');
      let res = await fetch(ppUrl);
      imgBuffer = await res.arrayBuffer().then(buf => Buffer.from(buf)); // [FIX 2] buffer() -> arrayBuffer()
    } catch {
      let res = await fetch('https://files.evogb.win/wX15Ie.jpg');
      imgBuffer = await res.arrayBuffer().then(buf => Buffer.from(buf));
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

    // ENVIAR IMAGEN
    await conn.sendMessage(m.chat, {
      image: imgBuffer,
      caption: text,
      mentions: [user]
    });

    // ENVIAR AUDIO
    const audioPath = path.resolve(audioFile);
    if (fs.existsSync(audioPath)) {
      await new Promise(r => setTimeout(r, 1200));
      await conn.sendMessage(m.chat, {
        audio: fs.readFileSync(audioPath),
        mimetype: 'audio/mpeg',
        ptt: false
      });
      console.log(chalk.green(`[WELCOME] ✅ ${audioFile}`));
    }

  } catch (e) {
    console.log(chalk.red('[WELCOME ERROR]', e));
  }
  return true;
}

export const disabled = false;