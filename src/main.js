import { Telegraf } from "telegraf"
import config from 'config'
import { message } from 'telegraf/filters'
import { ogg } from './ogg.js' 
import { openai } from './openai.js' 
import { code } from 'telegraf/format' 

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'))


bot.on(message('voice'), async ctx => {
    try {
        await ctx.reply(code('Прийняв, чекай на вiдповiдь...'))
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
        const userId = String(ctx.message.from.id)
        const date = String(ctx.message.date)
        console.log(link.href)
        const oggPath = await ogg.create(link.href, userId)
        const mp3Path = await ogg.toMp3(oggPath, userId)
        
        const text = await openai.transcription(mp3Path)
        const messages = [{role: openai.roles.USER, content: text}]
        const response = await openai.chat(messages)
        
        await ctx.reply(text ? `Козаче, ось шо ти тут напездiв: "${text}"` : 'Сорi, Андрєй тимчасово мене вирубив i пiшов дрочити свого корнiшона. Якось iншим разом.')
        await ctx.reply(response.content)
        
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