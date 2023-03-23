import { Command, CommandOption, Bot } from "../../classes/Bot";
import {CommandInteraction, EmbedBuilder} from "discord.js";
import { validateMusicUser, getProgressBar } from "../../classes/Music";
import strings from "../../assets/en_US.json" assert { type: "json" };
let m = strings.sets.music
let distube = Bot.distube!;
export default class extends Command {
    override async run(interaction: CommandInteraction, bot: Bot): Promise<void> {
        await interaction.deferReply();

        if (!validateMusicUser(interaction, true)) return;

        const queue = distube.getQueue(interaction.guildId!)!;

        let currentSong = queue.songs.at(-1)!;

        const queueEmbed = new EmbedBuilder()
            .setColor(0x780aff)
            .setTitle(m.nowplaying_embed_title)
            .setThumbnail(currentSong.thumbnail as string)
            .setDescription(m.queue_embed_description
                .replaceAll('{currentSongName}', currentSong.name as string)
                .replaceAll('{currentSongUrl}', currentSong.url as string)
                .replaceAll("{currentSongFormattedDuration}", currentSong.formattedDuration as string)
            )


        queueEmbed.addFields(
            {
                name: m.queue_embed_progress,
                value: `${queue.formattedCurrentTime} | ${getProgressBar(queue.currentTime, currentSong.duration)} | ${currentSong.formattedDuration}`,
                inline: true
            }
        );


        await interaction.editReply({ embeds: [queueEmbed] });
    }


    override name(): string {
        return "nowplaying";
    }

    override description(): string {
        return "View the currently playinng song";
    }

    override options(): CommandOption[] {
        return [];
    }
}
