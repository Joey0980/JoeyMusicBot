import {Command, CommandOption, Bot, CommandPermissions} from "../classes/Bot";
import {
    ApplicationCommandOptionType,
    GuildMember,
    VoiceChannel,
    ChatInputCommandInteraction
} from "discord.js";
import {validateMusicUser, getRedEmbed,} from "../classes/Music";
import i18nInterface from "../i18n/i18nInterface";

export default class extends Command {
    override async run(interaction: ChatInputCommandInteraction, bot: Bot,  i18n: i18nInterface): Promise<void> {
        await interaction.deferReply();
        if (!validateMusicUser(interaction, i18n, false)) return;
        interaction.member = interaction.member as GuildMember;
        let vc = interaction.member.voice.channel as VoiceChannel

        try {
            await Bot.distube!.play(vc, interaction.options.get("query")?.value as string);
            let song = Bot.distube!.getQueue(interaction.guildId!)?.songs.slice(-1)[0]!;
            let footerTxt: string;
            let queueLength: any = Bot.distube!.getQueue(interaction.guildId!)!.songs.length;
            if (queueLength == 1) {
                footerTxt =  i18n.default.added_queue_embed_footer_nextup;
                queueLength = "";
            } else {
                footerTxt =  i18n.default.added_queue_embed_footer;
                queueLength = `(${queueLength - 1})`;
            }
            await interaction.editReply({embeds: [
                {
                    color: 0x780aff,
                    title:  i18n.default.added_queue_embed_title,
                    description: `**[${song.name}](${song.url})**\n[${song.uploader.name}](${song.uploader.url})`,
                    thumbnail: { url: song.thumbnail as string },
                    footer: { text: `${song.isLive? "🔴 " : ""}${song.formattedDuration}  •  ${footerTxt}${queueLength}` },
                },
            ]})
        } catch (error) {
            if (error instanceof Error) {
                // await interaction.editReply({embeds: [getRedEmbed( i18n.default.search_age_restricted)]});
                // return
                await interaction.editReply({embeds: [getRedEmbed( i18n.default.search_no_results.replace("{searchQuery}", interaction.options.get("query")?.value as string))]});
                return;
            }
            console.log(error);
        }
    }
    override name(): string {
        return "play";
    }

    override description(): string {
        return "Play a song (Youtube, Soundcloud, Spotify supported)";
    }

    override options(): CommandOption[] {
        return [
            {
                type: ApplicationCommandOptionType.String,
                name: "query",
                description: "The song to play",
                required: true
            }
        ];
    }

    override permissions(): CommandPermissions {
        return {
            dmUsable: false,
            DJRole: false,
            adminPermissionBypass: true
        }
    }
}

/*

{
                type: ApplicationCommandOptionType.Subcommand,
                name: "play",
                description: "Play a song",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "song",
                        description: "Url or search query",
                        required: true
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "skip",
                description: "Skip the current song"
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "stop",
                description: "Stop the music"
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "queue",
                description: "View the current queue"
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "pause",
                description: "Pause the current song"
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "resume",
                description: "Resume the current song"
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "loop",
                description: "Loop the current song"
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "shuffle",
                description: "Shuffle the current queue"
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "remove",
                description: "Remove a song from the queue",
                options: [
                    {
                        type: ApplicationCommandOptionType.Integer,
                        name: "index",
                        description: "The index of the song to remove",
                        required: true
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "volume",
                description: "Change the volume",
                options: [
                    {
                        type: ApplicationCommandOptionType.Integer,
                        name: "volume",
                        description: "The volume to set",
                        required: true
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "seek",
                description: "Seek to a specific time in the current song",
                options: [
                    {
                        type: ApplicationCommandOptionType.Integer,
                        name: "time",
                        description: "The time to seek to",
                        required: true
                    }
                ]
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "nowplaying",
                description: "View the current song"
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "lyrics",
                description: "View the lyrics of the current song"
            },
 */