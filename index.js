const TelegramApi = require('node-telegram-bot-api')

const token = '6287373591:AAFBha4AwNANJUSnhPF1QbuvahR15aHnd2A'
const { gameOptions, againOptions } = require('./options')

const bot = new TelegramApi(token, { polling: true })

const chats = {}

bot.setMyCommands([
  { command: '/start', description: 'Запуск бота' },
  { command: '/info', description: 'Информация о боте' },
  { command: '/game', description: 'Играть в угадай цифру' },
])

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    'Сейчас я загадаю число от 0 до 9, а ты попрбуй его угадать'
  )
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
  bot.on('message', async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id

    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.eu/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/11.webp'
      )
      return bot.sendMessage(chatId, 'Добро пожаловать в бот zangi')
    }

    if (text === '/info') {
      return bot.sendMessage(chatId, `Привет, ${msg.from.first_name}`)
    }

    if (text === '/game') {
      return await startGame(chatId)
    }

    return bot.sendMessage(chatId, 'моя твоя не понимать')
  })

  bot.on('callback_query', async (msg) => {
    const data = msg.data
    const chatId = msg.message.chat.id

    if (data === '/again') {
      return await startGame(chatId)
    }

    if (data == chats[chatId]) {
      return bot.sendMessage(chatId, `Угадал!`, againOptions)
    } else {
      return bot.sendMessage(
        chatId,
        `Не угадал( была цифра ${chats[chatId]}`,
        againOptions
      )
    }
  })
}

start()
