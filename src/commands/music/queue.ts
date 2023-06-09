import { Command, CommandOption, Bot } from "../../classes/Bot";
import {CommandInteraction, EmbedBuilder} from "discord.js";
import { validateMusicUser, getProgressBar } from "../../classes/Music";
import strings from "../../assets/en_US.json" assert { type: "json" };
let m = strings.sets.music
export default class extends Command {
    override async run(interaction: CommandInteraction, bot: Bot): Promise<void> {
        await interaction.deferReply();

        if (!validateMusicUser(interaction, true)) return;

        const queue = Bot.distube!.getQueue(interaction.guildId!);

        if (!queue || !queue.songs.length) {
            await interaction.editReply({
                embeds: [
                    {
                        color: 0x780aff,
                        description: m.queue_empty
                    },
                ]
            })
            return;
        }

        const currentSong = queue.songs[0]!;
        const queueSongs = queue.songs.slice(1);


        const queueEmbed = new EmbedBuilder()
            .setColor(0x780aff)
            .setTitle(m.queue_embed_title)
            .setThumbnail(currentSong.thumbnail as string)
            .setDescription(m.queue_embed_description
                .replaceAll('{currentSongName}', currentSong.name as string)
                .replaceAll('{currentSongUrl}', currentSong.url as string)
                .replaceAll('{currentSongFormattedDuration}', currentSong.formattedDuration as string)
            )
        if (queueSongs.length > 0) {
            const songList = queueSongs.map((song, index) => `[${index + 1}. ${song.name}](${song.url}) (${song.formattedDuration})`);
            if (songList.length > 10) {
                songList.length = 10;
                songList.push(m.queue_embed_toomany);
            }
            console.log(songList.join('\n'));
            queueEmbed.addFields(
                { name: m.queue_embed_upnexttitle, value: songList.join('\n') },
                {
                    name: m.queue_embed_progress,
                    value: `${queue.formattedCurrentTime} | ${getProgressBar(queue.currentTime, currentSong.duration)} | ${currentSong.formattedDuration}`,
                    inline: true
                }
            );
        }

        const queueLength = queueSongs.length + 1;
        queueEmbed.setFooter({
            text: queueSongs.length <= 1 && currentSong.isLive ?
                m.queue_embed_footer_1
                    .replaceAll('{queueLength}', queueLength.toString())
                + m.live
                : m.queue_embed_footer_1
                .replaceAll('{queueLength}', queueLength.toString())
                + m.queue_embed_footer_2
                .replaceAll('{totalDuration}', queue.formattedDuration)
        });

// m.queue_embed_footer_1 + m.queue_embed_footer_2
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
}
