import {EmbedBuilder, GuildMember, VoiceChannel, CommandInteraction} from "discord.js";
import { Bot } from "./Bot";
import i18nInterface from "../i18n/i18nInterface";

function getRedEmbed (description: string) {
    return new EmbedBuilder({
        color: 0xff0000,
        description: description
    })
}

function getPurpleEmbed (description: string) {
    return new EmbedBuilder({
        color: 0x780aff,
        description: description
    })
}


function validateMusicUser (interaction: CommandInteraction,  i18n: i18nInterface, checkForCurrentQueue?: boolean,) {
    interaction.member = interaction.member as GuildMember;
    let vc = interaction.member.voice.channel as VoiceChannel;

    if (!vc) {
        interaction.editReply({embeds: [getRedEmbed( i18n.default.vc_user_absent)]});
        return false;
    }

    if (checkForCurrentQueue) {
        if (!Bot.distube!.getQueue(interaction.guild!.id)) {
            interaction.editReply({embeds: [getRedEmbed( i18n.default.no_current_queue)]});
            return false;
        }
    }

    if (vc.id !== interaction.guild!.members.me!.voice.channelId && interaction.guild!.members.me!.voice.channelId) {
        interaction.editReply({embeds: [getRedEmbed( i18n.default.vc_user_different)]});
        return false;
    }
    return true;
}

function getProgressBar(currentTime: number, duration: number ): string {
    const progress = currentTime / duration;
    const progressBar = new Array(10).fill('▬');
    const progressIndex = Math.round(progress * 10) - 1;
    if (progressIndex >= 0 && progressIndex < 10) {
        progressBar[progressIndex] = '🔘';
    }
    return progressBar.join('');
}

export { getRedEmbed, getPurpleEmbed, validateMusicUser, getProgressBar };