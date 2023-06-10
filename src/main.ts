import { Bot } from './classes/Bot';

new Bot(process.env.TOKEN as never,
    { intents: [
            "GuildMessages",
            "Guilds",
            "GuildMessageReactions",
            "MessageContent",
            "GuildVoiceStates"
        ]},
    "music");

Reflect.deleteProperty(process.env, 'TOKEN');