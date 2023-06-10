import { Command, CommandOption, Bot } from "../../classes/Bot";
import { CommandInteraction } from "discord.js";
import { validateMusicUser,} from "../../classes/Music";
import strings from "../../assets/en_US.json" assert { type: "json" };
let m = strings.sets.music
export default class extends Command {
    override async run(interaction: CommandInteraction, bot: Bot): Promise<void> {
        await interaction.deferReply();

        if (!validateMusicUser(interaction, true)) return;
        let paused = Bot.distube!.getQueue(interaction.guild!.id)?.paused;

        if (paused) await Bot.distube!.resume(interaction.guild!.id);
            else Bot.distube!.pause(interaction.guild!.id);

        await interaction.editReply({ embeds: [
                {
                    color: 0x780aff,
                    description: paused ? m.unpaused : m.paused
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
}
