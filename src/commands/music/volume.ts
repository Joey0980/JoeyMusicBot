import { Command, CommandOption, Bot } from "../../classes/Bot";
import {ApplicationCommandOptionType, CommandInteraction} from "discord.js";
import { validateMusicUser,} from "../../classes/Music";
import strings from "../../assets/en_US.json" assert { type: "json" };
let m = strings.sets.music

export default class extends Command {
    override async run(interaction: CommandInteraction, bot: Bot): Promise<void> {
        await interaction.deferReply();

        let vol = interaction.options.get("volume")?.value as number;

        if (!validateMusicUser(interaction, true)) return;

        if (vol > 100) {
            await interaction.editReply({ embeds: [
                {
                    color: 0x780aff,
                    description: m.volume_syntax
                },
            ]})
            return;
        }

        await Bot.distube!.getQueue(interaction.guild!.id)?.setVolume(vol);

        await interaction.editReply({ embeds: [
            {
                color: 0x780aff,
                description: m.volume_set
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
}
