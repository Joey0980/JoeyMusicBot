import {Command, CommandOption, Bot, CommandPermissions} from "../classes/Bot";
import {ChatInputCommandInteraction, EmbedBuilder} from "discord.js";
import { validateMusicUser, getProgressBar } from "../classes/Music";
import i18nInterface from "../i18n/i18nInterface";
export default class extends Command {
    override async run(interaction: ChatInputCommandInteraction, bot: Bot,  i18n: i18nInterface): Promise<void> {
        await interaction.deferReply();

        if (!validateMusicUser(interaction, i18n, true)) return;

        const queue = Bot.distube!.getQueue(interaction.guildId!);

        if (!queue || !queue.songs.length) {
            await interaction.editReply({
                embeds: [
                    {
                        color: 0x780aff,
                        description:  i18n.default.queue_empty
                    },
                ]
            })
            return;
        }

        const currentSong = queue.songs[0]!;
        const queueSongs = queue.songs.slice(1);


        const queueEmbed = new EmbedBuilder()
            .setColor(0x780aff)
            .setTitle( i18n.default.queue_embed_title)
            .setThumbnail(currentSong.thumbnail as string)
            .setDescription( i18n.default.queue_embed_description
                .replaceAll('{currentSongName}', currentSong.name as string)
                .replaceAll('{currentSongUrl}', currentSong.url as string)
                .replaceAll('{currentSongFormattedDuration}', currentSong.formattedDuration as string)
            )
        if (queueSongs.length > 0) {
            const songList: string[] = queueSongs.map((song, index) => `[${index + 1}. ${song.name}](${song.url}) (${song.formattedDuration})`);
            if (songList.join('\n').length > 1015 -  i18n.default.queue_embed_toomany.length) {
                // truncation
                let newList : string[] = [];

                for (let song of songList) {
                    if (song.length + newList.join('\n').length > 1015 -  i18n.default.queue_embed_toomany.length) break;
                    newList.push(song);
                }

                songList.length = 0;

                songList.push(...newList);

                songList.push( i18n.default.queue_embed_toomany.replaceAll('{count}', songList.length.toString()));
            }

            queueEmbed.addFields(
                {
                    name:  i18n.default.queue_embed_upnexttitle,
                    value: songList.join('\n')
                },
                {
                    name:  i18n.default.queue_embed_progress,
                    value: `${queue.formattedCurrentTime} | ${getProgressBar(queue.currentTime, currentSong.duration)} | ${currentSong.formattedDuration}`,
                    inline: true
                }
            );
        }

        const queueLength = queueSongs.length + 1;
        queueEmbed.setFooter({
            text: queueSongs.length <= 1 && currentSong.isLive ?
                 i18n.default.queue_embed_footer_1
                    .replaceAll('{queueLength}', queueLength.toString())
                +  i18n.default.live
                :  i18n.default.queue_embed_footer_1
                .replaceAll('{queueLength}', queueLength.toString())
                +  i18n.default.queue_embed_footer_2
                .replaceAll('{totalDuration}', queue.formattedDuration)
        });

//  i18n.default.queue_embed_footer_1 +  i18n.default.queue_embed_footer_2
//
//
        await interaction.editReply({ embeds: [queueEmbed] });
    }

    override name(): string {
        return "queue";
    }

    override description(): string {
        return "View the music queue";
    }

    override options(): CommandOption[] {
        return [];
    }

    override permissions(): CommandPermissions {
        return {
            dmUsable: false,
            DJRole: false,
            adminPermissionBypass: true
        }
    }
}
