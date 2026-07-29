import { promises } from 'fs'
import { join } from 'path'
import { xpRange } from '../lib/levelling.js'

let tags = {
  'main': '✨ Información',
  'search': '🔍 Búsqueda',
  'game': '🎮 Juegos',
  'serbot': '🤖 Sub-Bots',
  'rpg': '⚔️ Rpg',
  'rg': '📝 Registro',
  'sticker': '🎨 Sticker',
  'img': '🖼️ Imagen',
  'group': '👥 Grupos',
  'nable': '⚙️ On / Off',
  'premium': '💎 Premium',
  'downloader': '📥 Descargas',
  'tools': '🛠️ Herramientas',
  'fun': '🎭 Diversión',
  'nsfw': '🔞 Nsfw',
  'cmd': '💾 Base de Datos',
  'owner': '👑 Creador',
  'audio': '🎵 Audios',
  'advanced': '⚡ Avanzado',
}

const defaultMenu = {
  before: `
╭─────「 ⚡ CYBER BOT ⚡ 」
│
│ *Hola %name*
│ %greeting
│
│ 📊 *Sistema*
│ ├─ Estado: *Online*
│ ├─ Baileys: *MD v6.7.14*
│ ├─ Uptime: *%uptime*
│ ├─ Usuarios: *%totalreg*
│ └─ Versión: *v%version*
╰─────────────────
%readmore
╭───「 📜 *MÓDULOS* 」───
`.trimStart(),

  header: `│ ◈ *%category* ◈`,
  body: `│ › %cmd %islimit %isPremium`,
  footer: `╰─────────────────\n`,

  after: `
╰─────────────────
> *Powered By* @whois.yallico
`.trim(),
}

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { exp, limit, level } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let _uptime = process.uptime() * 1000
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length

    let help = Object.values(global.plugins).filter(plugin =>!plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.help)? plugin.help : [plugin.help],
      tags: Array.isArray(plugin.tags)? plugin.tags : [plugin.tags],
      prefix: 'customPrefix' in plugin,
      limit: plugin.limit,
      premium: plugin.premium,
      enabled:!plugin.disabled,
    }))

    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag

    conn.menu = conn.menu? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || defaultMenu.after

    // OCULTAR CATEGORIAS VACIAS
    let _text = [
      before,
   ...Object.keys(tags).map(tag => {
        let cmds = help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help)
        if (cmds.length === 0) return ''

        return header.replace(/%category/g, tags[tag]) + '\n' + [
       ...cmds.map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix? help : '%p' + help)
             .replace(/%islimit/g, menu.limit? '⭐' : '')
             .replace(/%isPremium/g, menu.premium? '💎' : '')
             .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }).filter(v => v!== ''),
      after
    ].join('\n')

    let text = typeof conn.menu == 'string'? conn.menu : typeof conn.menu == 'object'? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, _uptime,
      taguser: '@' + m.sender.split("@s.whatsapp.net")[0],
      me: conn.getName(conn.user.jid),
      npmname: _package.name,
      version: _package.version,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      greeting, level, limit, name, totalreg, rtotalreg,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])

    await m.react('⚡')

    // FOTO DEL GRUPO O DEFAULT CYBER
    let pp
    try {
      pp = await conn.profilePictureUrl(m.chat, 'image')
    } catch {
      pp = 'https://telegra.ph/file/4c3e4b782c82511b3874d.jpg' // pon aqui una img cyberpunk
    }

    await conn.sendMessage(m.chat, {
      image: { url: pp },
      caption: text.trim(),
      mentions: [m.sender]
    }, { quoted: m })

  } catch (e) {
    await m.react('✖️')
    console.log(e)
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menú']
handler.register = false

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(":")
}

var ase = new Date();
var hour = ase.getHours();
var greeting = "espero que tengas " + (
  hour < 5? 'una buena noche 🌙' :
  hour < 12? 'una buena mañana ✨' :
  hour < 18? 'una buena tarde 🌇' :
  'una buena noche 🌃'
);