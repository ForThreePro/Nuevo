import { WAMessageStubType } from '@whiskeysockets/baileys';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export async function before(m, { conn }) {
  if (!m.messageStubType ||!m.isGroup) return true;

  const chat = global.db?.data?.chats?.[m.chat];
  if (!chat) return true;

  try {
    const groupMetadata = await conn.groupMetadata(m.chat).catch(() => null);
    if (!groupMetadata) return true;

    let userJid = m.messageStubParameters?.[0];
    if (!userJid) return true;

    // [FIX @lid]
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

    // [FIX ANTI-CRASH] FOTO CON TRY-CATCH DOBLE
    let imgBuffer = null;
    try {
      let ppUrl = await conn.profilePictureUrl(user, 'image').catch(() => null);
      if (ppUrl) {
        let res = await fetch(ppUrl, { timeout: 5000 }).catch(() => null); // timeout 5s
        if (res && res.ok) {
          let buf = await res.arrayBuffer().catch(() => null);
          if (buf) imgBuffer = Buffer.from(buf);
        }
      }
    } catch {}

    // [SI FALLA = LOGO DEFAULT]
    if (!imgBuffer) {
      try {
        let res = await fetch('https://files.evogb.win/wX15Ie.jpg', { timeout: 5000 });
        let buf = await res.arrayBuffer();
        imgBuffer = Buffer.from(buf);
      } catch {
        imgBuffer = null; // si falla todo, mandamos solo texto
      }
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

    // ENVIAR: Si hay imagen manda imagen, si no solo texto
    if(imgBuffer){
      await conn.sendMessage(m.chat, { image: imgBuffer, caption: text, mentions: [user] }).catch(() => {});
    } else {
      await conn.sendMessage(m.chat, { text: text, mentions: [user] }).catch(() => {});
    }

    // ENVIAR AUDIO
    const audioPath = path.resolve(audioFile);
    if (fs.existsSync(audioPath)) {
      await new Promise(r => setTimeout(r, 1500));
      await conn.sendMessage(m.chat, {
        audio: fs.readFileSync(audioPath),
        mimetype: 'audio/mpeg',
        ptt: false
      }).catch(() => {});
      console.log(chalk.green(`[WELCOME] ✅ ${audioFile}`));
    }

  } catch (e) {
    console.log(chalk.red('[WELCOME ERROR]', e));
  }
  return true;
}

export const disabled = false;