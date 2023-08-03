import {Command, CommandOption, Bot, CommandPermissions} from "../classes/Bot";
import {ApplicationCommandOptionType, ChatInputCommandInteraction} from "discord.js";
import {getRedEmbed, getPurpleEmbed, validateMusicUser} from "../classes/Music";
import i18nInterface from "../i18n/i18nInterface";

export default class extends Command {
    override async run(interaction: ChatInputCommandInteraction, bot: Bot,  i18n: i18nInterface): Promise<void> {
        await interaction.deferReply();
        if (!validateMusicUser(interaction, i18n, true)) return;

        let time: number = interaction.options.getInteger("time")!;
        if (time < 0 || time > Bot.distube!.getQueue(interaction.guild!.id)!.songs[0]!.duration || isNaN(time)) {
            await interaction.editReply({ embeds: [getRedEmbed(i18n.default.seeked_invalid)] });
        }
        let queue = Bot.distube!.getQueue(interaction.guild!.id)!;
        console.log(time);
        await queue.seek(time);

        await interaction.editReply({ embeds: [getPurpleEmbed(i18n.default.seeked.replaceAll("{time}", time.toString()))] });

    }
    override name(): string {
        return "seek";
    }

    override description(): string {
        return "Seek to a certian point in the song";
    }

    override options(): CommandOption[] {
        return [{
            type: ApplicationCommandOptionType.Integer,
            name: "time",
            description: "The time to seek to",
            required: true
        }]
    }

    override permissions(): CommandPermissions {
        return {
            dmUsable: false,
            adminPermissionBypass: true,
            DJRole: true
        }
    }
}
