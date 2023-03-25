import { Command, CommandOption, Bot } from "../../classes/Bot";
import {ApplicationCommandOptionType, CommandInteraction} from "discord.js";
import { validateMusicUser,} from "../../classes/Music";
import strings from "../../assets/en_US.json" assert { type: "json" };
let m = strings.sets.music
let distube = Bot.distube!;
export default class extends Command {
    override async run(interaction: CommandInteraction, bot: Bot): Promise<void> {
        await interaction.deferReply();

        if (!validateMusicUser(interaction, true)) return;

        await distube.stop(interaction.guild!.id);

        await interaction.editReply({ embeds: [
                {
                    color: 0x780aff,
                    description: m.cleared
                },
            ]})

    }
    override name(): string {
        return "remove";
    }

    override description(): string {
        return "Remove an entry from the queue. Use /queue to see the queue";
    }

    override options(): CommandOption[] {
        return [
            {
                type: ApplicationCommandOptionType.Integer,
                name: "index",
                description: "The index of the song to remove",
                required: true
            }
        ];
    }
}
