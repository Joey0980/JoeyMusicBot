import { Command, CommandOption, Bot } from "../../classes/Bot";
import {CommandInteraction, EmbedBuilder} from "discord.js";
import { validateMusicUser, getProgressBar } from "../../classes/Music";
import strings from "../../assets/en_US.json" assert { type: "json" };
let m = strings.sets.music

export default class extends Command {
    override async run(interaction: CommandInteraction, bot: Bot): Promise<void> {
        await interaction.deferReply();

        if (!validateMusicUser(interaction, true)) return;

        const queue = Bot.distube!.getQueue(interaction.guildId!)!;

        let currentSong = queue.songs.at(0)!;

        const queueEmbed = new EmbedBuilder()
            .setColor(0x780aff)
            .setTitle(m.nowplaying_embed_title)
            .setThumbnail(currentSong.thumbnail as string)
            .setDescription(m.nowplaying_embed_description
                .replaceAll('{currentSongName}', currentSong.name as string)
                .replaceAll('{currentSongUrl}', currentSong.url as string)
                .replaceAll('{currentSongFormattedDuration}', currentSong.formattedDuration as string)
            )
            .addFields(
            {
                name: m.queue_embed_progress,
                value: currentSong.isLive ? m.live : `${queue.formattedCurrentTime} | ${getProgressBar(queue.currentTime, currentSong.duration)} | ${currentSong.formattedDuration}`,
                inline: true
            }
        );
        await interaction.editReply({ embeds: [queueEmbed] });
    }

    override name(): string {
        return "nowplaying";
    }

    override description(): string {
        return "View the currently playing song";
    }

    override options(): CommandOption[] {
        return [];
    }
}
