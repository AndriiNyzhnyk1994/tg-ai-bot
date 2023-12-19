import { Telegraf } from "telegraf"
import config from 'config'
import { message } from 'telegraf/filters'
import { ogg } from './ogg.js' 
import { openai } from './openai.js' 

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))


bot.on(message('voice'), async ctx => {
    try {
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
        const userId = String(ctx.message.from.id)
        const date = String(ctx.message.date)
        console.log(link.href)
        const oggPath = await ogg.create(link.href, userId)
        const mp3Path = await ogg.toMp3(oggPath, userId)
        
        const text = await openai.transcription(mp3Path)
        // const response = await openai.chat(text)
        
        await ctx.reply(text ? text : 'nothing recorded')
        console.log(ctx.message);
    } catch (e) {
        console.log('Error while voice message', e.message);
    }


})

bot.command('start', async (ctx) => {
    ctx.reply(JSON.stringify(ctx.message, null, 2))
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))