import { Command, CommandOption, Bot } from "../../classes/Bot";
import {ApplicationCommandOptionType, CommandInteraction} from "discord.js";
import {getRedEmbed, getPurpleEmbed, validateMusicUser} from "../../classes/Music";
import strings from "../../assets/en_US.json" assert { type: "json" };
let m = strings.sets.music

export default class extends Command {
    override async run(interaction: CommandInteraction, bot: Bot): Promise<void> {
        await interaction.deferReply();
        if (!validateMusicUser(interaction, true)) return;

        let time: number = Number(interaction.options.get("time")!)
        if (time < 0 || time > Bot.distube!.getQueue(interaction.guild!.id)!.songs[0]!.duration || isNaN(time)) {
            await interaction.editReply({ embeds: [getRedEmbed(m.seeked_invalid)] });
        }
        let queue = Bot.distube!.getQueue(interaction.guild!.id)!;
        console.log(time);
        await queue.seek(time);

        await interaction.editReply({ embeds: [getPurpleEmbed(m.seeked)] })
    }
    override name(): string {
        return "seek";
    }

    override description(): string {
        return "Seek to a certian point in the song";
    }

    override options(): CommandOption[] {
        return [{
            type: ApplicationCommandOptionType.Integer,
            name: "time",
            description: "The time to seek to",
            required: true
        }]
    }
}
