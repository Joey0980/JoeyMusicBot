import { Command, CommandOption, Bot } from "../../classes/Bot";
import {CommandInteraction } from "discord.js";
import {validateMusicUser,} from "../../classes/Music";
import strings from "../../assets/en_US.json" assert { type: "json" };
let m = strings.sets.music

export default class extends Command {
    override async run(interaction: CommandInteraction, bot: Bot): Promise<void> {
        await interaction.deferReply();

        if (!validateMusicUser(interaction, false)) return;

        Bot.distube!.voices.leave(interaction.guild!.id);

        await interaction.editReply({ embeds: [
                {
                    color: 0x780aff,
                    description: m.left
                },
            ]})
    }
    override name(): string {
        return "leave";
    }

    override description(): string {
        return "Leave your voice channel";
    }

    override options(): CommandOption[] {
        return [];
    }
}
