import {Command, CommandOption, Bot, CommandPermissions} from "../classes/Bot";
import {ChatInputCommandInteraction} from "discord.js";
import { validateMusicUser,} from "../classes/Music";
import i18nInterface from "../i18n/i18nInterface";

export default class extends Command {
    override async run(interaction: ChatInputCommandInteraction, bot: Bot,  i18n: i18nInterface): Promise<void> {
        await interaction.deferReply();

        if (!validateMusicUser(interaction, i18n, true)) return;

        await Bot.distube!.stop(interaction.guild!.id);

        await interaction.editReply({embeds: [
            {
                color: 0x780aff,
                description:  i18n.default.stopped
            },
        ]})
    }
    override name(): string {
        return "stop";
    }

    override description(): string {
        return "Stop the music";
    }

    override options(): CommandOption[] {
        return [];
    }

    override permissions(): CommandPermissions {
        return {
            dmUsable: false,
            DJRole: true,
            adminPermissionBypass: true,
        }
    }
}
