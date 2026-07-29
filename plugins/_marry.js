let handler = async (m, { conn, text }) => {
    if (!text) return m.reply(`💍 *USO:*.marry 51912345678\n*Pon el número completo con código de país*`)

    let who = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    if (who === m.sender) return m.reply('🙄 *No te puedes casar contigo mismo*')

    global.db.data.users[m.sender] = global.db.data.users[m.sender] || { pareja: null }
    global.db.data.users[who] = global.db.data.users[who] || { pareja: null }

    let user = global.db.data.users[m.sender]
    let target = global.db.data.users[who]

    if (user.pareja) return m.reply(`💍 *Ya estás casado*`)
    if (target.pareja) return m.reply(`💔 *Ya tiene pareja*`)

    user.pareja = who
    target.pareja = m.sender

    let name1 = await conn.getName(m.sender)
    let name2 = await conn.getName(who)

    await conn.sendMessage(m.chat, {
        image: { url: 'https://files.evogb.win/zu9HrE.jpg' },
        caption: `💒 *¡SE CASARON!* 💒\n\n@${name1} ❤️ @${name2}`,
        mentions: [m.sender, who]
    }, { quoted: m })
}

handler.command = /^marry$/i
handler.group = true
export default handler