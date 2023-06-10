// import DisTube from "distube";
import {EmbedBuilder, GuildMember, VoiceChannel, CommandInteraction} from "discord.js";
import strings from "../assets/en_US.json" assert { type: "json" };
let m = strings.sets.music;
import { Bot } from "./Bot";

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


function validateMusicUser (interaction: CommandInteraction, checkForCurrentQueue?: boolean) {
    interaction.member = interaction.member as GuildMember;
    let vc = interaction.member.voice.channel as VoiceChannel;

    if (!vc) {
        interaction.editReply({embeds: [getRedEmbed(m.vc_user_absent)]});
        return false;
    }

    if (checkForCurrentQueue) {
        if (!Bot.distube!.getQueue(interaction.guild!.id)) {
            interaction.editReply({embeds: [getRedEmbed(m.no_current_queue)]});
            return false;
        }
    }

    if (vc.id !== interaction.guild!.members.me!.voice.channelId && interaction.guild!.members.me!.voice.channelId) {
        interaction.editReply({embeds: [getRedEmbed(m.vc_user_different)]});
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