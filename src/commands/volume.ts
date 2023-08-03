import {Command, CommandOption, Bot, CommandPermissions} from "../classes/Bot";
import {ApplicationCommandOptionType, ChatInputCommandInteraction} from "discord.js";
import { validateMusicUser,} from "../classes/Music";
import i18nInterface from "../i18n/i18nInterface";

export default class extends Command {
    override async run(interaction: ChatInputCommandInteraction, bot: Bot,  i18n: i18nInterface): Promise<void> {
        await interaction.deferReply();

        let vol = interaction.options.get("volume")?.value as number;

        if (!validateMusicUser(interaction, i18n, true)) return;

        if (vol > 100) {
            await interaction.editReply({ embeds: [
                {
                    color: 0x780aff,
                    description:  i18n.default.volume_syntax
                },
            ]})
            return;
        }

        await Bot.distube!.getQueue(interaction.guild!.id)?.setVolume(vol);

        await interaction.editReply({ embeds: [
            {
                color: 0x780aff,
                description:  i18n.default.volume_set
                    .replace("{volume}", vol.toString())
                    .replace("{volumeEmoji}", vol > 55 ? "🔊" : "🔉")
            },
        ]})
    }
    override name(): string {
        return "volume";
    }

    override description(): string {
        return "Change the volume of the music";
    }

    override options(): CommandOption[] {
        return [
            {
                type: ApplicationCommandOptionType.Integer,
                name: "volume",
                description: "The volume",
                required: true
            }
        ];
    }

    override permissions(): CommandPermissions {
        return {
            dmUsable: false,
            DJRole: true,
            adminPermissionBypass: true,
        }
    }
}
