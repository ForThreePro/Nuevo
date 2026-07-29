let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin }) => {
  let isEnable = /true|on|1/i.test(command)
  let chat = global.db.data.chats[m.chat]
  let type = (args[0] || '').toLowerCase()

  if (type == 'welcome' || type == 'bienvenida' || type == 'bv') {
    if (!m.isGroup) return global.dfail('group', m, conn)
    if (!isAdmin) return global.dfail('admin', m, conn)

    chat.bienvenida = isEnable
    return m.reply(`*BIENVENIDA:* ${isEnable? 'ACTIVADA ✅' : 'DESACTIVADA ❌'}`)
  }

  // AQUI PUEDES AGREGAR MAS OPCIONES
  return m.reply(`*OPCIONES:* welcome`)
}

handler.command = /^(enable|disable|on|off|1|0)$/i
export default handler