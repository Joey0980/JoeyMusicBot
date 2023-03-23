import { Command, CommandOption, Bot } from "../../classes/Bot";
import { CommandInteraction } from "discord.js";
import { validateMusicUser,} from "../../classes/Music";
import strings from "../../assets/en_US.json" assert { type: "json" };
let m = strings.sets.music
let distube = Bot.distube!;
export default class extends Command {
    override async run(interaction: CommandInteraction, bot: Bot): Promise<void> {
        await interaction.deferReply();

        if (!validateMusicUser(interaction, true)) return;

        await distube.stop(interaction.guild!.id);

        await interaction.editReply({embeds: [
            {
                color: 0x780aff,
                description: m.stopped
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
}
