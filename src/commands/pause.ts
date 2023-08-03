import {Command, CommandOption, Bot, CommandPermissions} from "../classes/Bot";
import {ChatInputCommandInteraction} from "discord.js";
import { validateMusicUser,} from "../classes/Music";
import i18nInterface from "../i18n/i18nInterface";

export default class extends Command {
    override async run(interaction: ChatInputCommandInteraction, bot: Bot,  i18n: i18nInterface): Promise<void> {
        await interaction.deferReply();

        if (!validateMusicUser(interaction, i18n, true)) return;
        let paused = Bot.distube!.getQueue(interaction.guild!.id)?.paused;

        if (paused) await Bot.distube!.resume(interaction.guild!.id);
            else Bot.distube!.pause(interaction.guild!.id);

        await interaction.editReply({ embeds: [
                {
                    color: 0x780aff,
                    description: paused ?  i18n.default.unpaused :  i18n.default.paused
                },
            ]}
        )

    }

    override name(): string {
        return "pause";
    }

    override description(): string {
        return "Pause/Unpause the music";
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
