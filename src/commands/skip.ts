import {Command, CommandOption, Bot, CommandPermissions} from "../classes/Bot";
import {ChatInputCommandInteraction} from "discord.js";
import { validateMusicUser,} from "../classes/Music";
import i18nInterface from "../i18n/i18nInterface";

export default class extends Command {
    override async run(interaction: ChatInputCommandInteraction, bot: Bot, i18n: i18nInterface): Promise<void> {

        await interaction.deferReply();

        if (!validateMusicUser(interaction, i18n, true)) return;

        if (Bot.distube!.getQueue(interaction.guild!.id)!.songs.length <= 1) {
            await Bot.distube!.stop(interaction.guild!.id);
        } else {
            await Bot.distube!.skip(interaction.guild!.id);
        }

        await interaction.editReply({ embeds: [{ color: 0x780aff, description:  i18n.default.skipped }]});
    }
    override name(): string {
        return "skip";
    }

    override description(): string {
        return "Skip the current song";
    }

    override options(): CommandOption[] {
        return [];
    }

    override permissions(): CommandPermissions {
        return {
            dmUsable: false,
            DJRole: true,
        }
    }
}
