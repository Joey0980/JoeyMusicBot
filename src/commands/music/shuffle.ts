import { Command, CommandOption, Bot } from "../../classes/Bot";
import { CommandInteraction } from "discord.js";
import { validateMusicUser,} from "../../classes/Music";
import strings from "../../assets/en_US.json" assert { type: "json" };
let m = strings.sets.music
export default class extends Command {
    override async run(interaction: CommandInteraction, bot: Bot): Promise<void> {
        await interaction.deferReply();

        if (!validateMusicUser(interaction, true)) return;

        if (Bot.distube!.getQueue(interaction.guild!.id)!.songs.length < 3) {
            await interaction.editReply({
                embeds: [
                    {
                        color: 0x780aff,
                        description: m.shuffle_too_few
                    },
                ]
            })
            return;
        } else {
            await Bot.distube!.shuffle(interaction.guild!.id);
            await interaction.editReply({ embeds: [
                {
                    color: 0x780aff,
                    description: m.shuffled
                },
            ]})
        }
    }
    override name(): string {
        return "shuffle";
    }

    override description(): string {
        return "Shuffle the queue. Requires 3+ songs.";
    }

    override options(): CommandOption[] {
        return [];
    }
}
