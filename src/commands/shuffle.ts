import {Command, CommandOption, Bot, CommandPermissions} from "../classes/Bot";
import {ChatInputCommandInteraction} from "discord.js";
import { validateMusicUser,} from "../classes/Music";
import i18nInterface from "../i18n/i18nInterface";

export default class extends Command {
    override async run(interaction: ChatInputCommandInteraction, bot: Bot,  i18n: i18nInterface): Promise<void> {
        await interaction.deferReply();

        if (!validateMusicUser(interaction, i18n, true)) return;

        if (Bot.distube!.getQueue(interaction.guild!.id)!.songs.length < 3) {
            await interaction.editReply({
                embeds: [
                    {
                        color: 0x780aff,
                        description:  i18n.default.shuffle_too_few
                    },
                ]
            })
            return;
        } else {
            await Bot.distube!.shuffle(interaction.guild!.id);
            await interaction.editReply({ embeds: [
                {
                    color: 0x780aff,
                    description:  i18n.default.shuffled
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

    override permissions(): CommandPermissions {
        return {
            dmUsable: false,
            DJRole: true,
        }
    }
}
