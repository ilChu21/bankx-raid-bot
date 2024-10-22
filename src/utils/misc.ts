import { SendMessageOptions } from 'node-telegram-bot-api';

export const opts = (): SendMessageOptions => {
  return {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  };
};
