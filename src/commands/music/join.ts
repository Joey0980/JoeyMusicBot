import { Command, CommandOption, Bot } from "../../classes/Bot";
import {CommandInteraction, GuildMember, VoiceChannel} from "discord.js";
import {getRedEmbed, validateMusicUser,} from "../../classes/Music";
import strings from "../../assets/en_US.json" assert { type: "json" };
let m = strings.sets.music
let distube = Bot.distube!;
export default class extends Command {
    override async run(interaction: CommandInteraction, bot: Bot): Promise<void> {
        await interaction.deferReply();

        if (!validateMusicUser(interaction, false)) return;
        interaction.member = interaction.member as GuildMember;
        let vc = interaction.member.voice.channel as VoiceChannel;

        let distube_vc = distube.voices.get(interaction.guild!.id);

        if (distube_vc /* &&  distube_vc.channel.id == vc.id */) {
            await interaction.editReply({ embeds: [getRedEmbed(m.already_joined)]})
            return;
        }

        await distube.voices.join(vc);

        await interaction.editReply({ embeds: [
                {
                    color: 0x780aff,
                    description: m.joined
                },
            ]})
    }
    override name(): string {
        return "join";
    }

    override description(): string {
        return "Join your voice channel";
    }

    override options(): CommandOption[] {
        return [];
    }
}
