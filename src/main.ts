import { Bot } from './classes/Bot';
import { ActivityType } from 'discord.js';

new Bot(process.env.TOKEN as never,
    { intents: [
            "GuildMessages",
            "Guilds",
            "GuildMessageReactions",
            "MessageContent",
            "GuildVoiceStates"
        ]},
    "online",
    { type: ActivityType.Playing, name: "music" });

Reflect.deleteProperty(process.env, 'TOKEN');