import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { bot } from './telegram/client';
import { ALLOWED_USERNAME } from './utils/env-vars';
import { opts } from './utils/misc';

console.log('BankX Raid bot started...');

const gifUrl =
  'https://cdn.discordapp.com/attachments/1001892605551988886/1298016825233244170/BankXAnimationBlueBackground-ezgif.com-video-to-gif-converter.gif?ex=671807df&is=6716b65f&hm=a2b9f075e3138eec9a64fed8fcd788bd6612baae7c77181708f31e49ce91e586&';

const sendGif = async (chatId: number, gifUrl: string, caption?: string) => {
  try {
    await bot.sendAnimation(chatId, gifUrl, { caption, ...opts() });
  } catch (error) {
    console.error('Error sending GIF:', error);
  }
};

const setChatPermissions = async (chatId: number, canSendMessages: boolean) => {
  try {
    await bot.setChatPermissions(chatId, {
      can_send_messages: canSendMessages,
    });
  } catch (error) {
    console.error('Error setting chat permissions:', error);
  }
};

const handleRaidCommand = async (
  msg: TelegramBot.Message,
  canSendMessages: boolean,
  action: string
) => {
  try {
    const chatId = msg.chat.id;
    const username = msg.from?.username;

    if (!username || username !== ALLOWED_USERNAME) {
      await bot.sendMessage(
        chatId,
        'You are not authorized to use this command.'
      );
      return;
    }

    await bot.deleteMessage(chatId, msg.message_id);
    await setChatPermissions(chatId, canSendMessages);

    if (canSendMessages !== false) {
      await bot.sendMessage(chatId, `<b>Raid ${action}!</b>`, opts());
      return;
    }

    const caption =
      `<b>Raid ${action}! 🚨</b>\n\n` + msg.text?.split(' ').slice(1).join(' ');

    await sendGif(chatId, gifUrl, caption);
  } catch (error) {
    console.error(error);
  }
};

bot.onText(/\/startraid/, async (msg) => {
  await handleRaidCommand(msg, false, 'started');
});

bot.onText(/\/endraid/, async (msg) => {
  await handleRaidCommand(msg, true, 'ended');
});
