let handler = async (m, { conn, usedPrefix, isOwner }) => {
let vcard = `BEGIN:VCARD\nVERSION:3.0\nN:;Irokz Dal ダーク;;\nFN:Irokz Dal ダーク\nORG:Irokz Dal ダーク\nTITLE:\nitem1.TEL;waid=51927174369:51927174369\nitem1.X-ABLabel:Whois Yallico ダーク⁩\nX-WA-BIZ-DESCRIPTION:\nX-WA-BIZ-NAME:Whois Yallico ダーク\nEND:VCARD`
await conn.sendMessage(m.chat, { contacts: { displayName: 'Whois Yallicoダーク⁩', contacts: [{ vcard }] }}, {quoted: m})
}
handler.help = ['owner']
handler.tags = ['main']
handler.command = ['owner', 'creator', 'creador', 'dueño'] 

export default handler
