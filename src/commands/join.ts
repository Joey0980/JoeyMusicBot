import {Command, CommandOption, Bot, CommandPermissions} from "../classes/Bot";
import {ChatInputCommandInteraction, GuildMember, VoiceChannel} from "discord.js";
import {getRedEmbed, validateMusicUser,} from "../classes/Music";
import i18nInterface from "../i18n/i18nInterface";

export default class extends Command {
    override async run(interaction: ChatInputCommandInteraction, bot: Bot,  i18n: i18nInterface): Promise<void> {
        await interaction.deferReply();

        if (!validateMusicUser(interaction, i18n, false)) return;
        interaction.member = interaction.member as GuildMember;
        let vc = interaction.member.voice.channel as VoiceChannel;

        let distube_vc = Bot.distube!.voices.get(interaction.guild!.id);

        if (distube_vc /* &&  distube_vc.channel.id == vc.id */) {
            await interaction.editReply({ embeds: [getRedEmbed( i18n.default.already_joined)]})
            return;
        }

        try {
            await Bot.distube!.voices.join(vc);
        } catch (e) {
            await interaction.editReply({ embeds: [getRedEmbed( i18n.default.could_not_join)]})
            return;
        }

        await interaction.editReply({ embeds: [
                {
                    color: 0x780aff,
                    description:  i18n.default.joined
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

    override permissions(): CommandPermissions {
        return {
            dmUsable: false,
            adminPermissionBypass: true
        }
    }
}
