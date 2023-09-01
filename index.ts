import { Bot } from './src/bot'

const bot = new Bot({
	userId: "997921076170473532",
	token: process.env.token,
	cache: true
})

bot.start()