import {Command, CommandOption, Bot, CommandPermissions} from "../classes/Bot";
import {ChatInputCommandInteraction, EmbedBuilder} from "discord.js";
import { validateMusicUser, getProgressBar } from "../classes/Music";
import i18nInterface from "../i18n/i18nInterface";

export default class extends Command {
    override async run(interaction: ChatInputCommandInteraction, bot: Bot,  i18n: i18nInterface): Promise<void> {
        await interaction.deferReply();

        if (!validateMusicUser(interaction, i18n, true)) return;

        const queue = Bot.distube!.getQueue(interaction.guildId!)!;

        let currentSong = queue.songs.at(0)!;

        const queueEmbed = new EmbedBuilder()
            .setColor(0x780aff)
            .setTitle( i18n.default.nowplaying_embed_title)
            .setThumbnail(currentSong.thumbnail as string)
            .setDescription( i18n.default.nowplaying_embed_description
                .replaceAll('{currentSongName}', currentSong.name as string)
                .replaceAll('{currentSongUrl}', currentSong.url as string)
                .replaceAll('{currentSongFormattedDuration}', currentSong.formattedDuration as string)
            )
            .addFields(
            {
                name:  i18n.default.queue_embed_progress,
                value: currentSong.isLive ?  i18n.default.live : `${queue.formattedCurrentTime} | ${getProgressBar(queue.currentTime, currentSong.duration)} | ${currentSong.formattedDuration}`,
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

    override permissions(): CommandPermissions {
        return {
            dmUsable: false,
            DJRole: false,
            adminPermissionBypass: true
        }
    }
}
