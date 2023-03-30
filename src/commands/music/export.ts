import { Command, CommandOption, Bot} from "../../classes/Bot";
import {ApplicationCommandOptionType, CommandInteraction} from "discord.js";
import {getRedEmbed, validateMusicUser,} from "../../classes/Music";
import strings from "../../assets/en_US.json" assert { type: "json" };
let m = strings.sets.music
let distube = Bot.distube!;
export default class extends Command {
    override async run(interaction: CommandInteraction, bot: Bot): Promise<void> {
        await interaction.deferReply();

        if (!validateMusicUser(interaction, true)) return;

        let queue = distube.getQueue(interaction.guild!.id);
        if (!queue) {
            await interaction.editReply({ embeds: [getRedEmbed(m.queue_empty)]})
            return;
        }

        let jsonPre = queue.songs.map((song) => {
            let {formats, related, ...songPre} = song;
            return songPre;
        })


        let json = JSON.stringify(jsonPre, null, 4)

        try {
            await interaction.user.send({
                embeds: [
                {
                    color: 0x780aff,
                    title: m.export_embed_title,
                    url: interaction.channel!.url,
                    fields: [
                        {
                            name: m.export_embed_guild,
                            value: `${interaction.guild!.name} (${interaction.guild!.id})`,
                        },
                        {
                            name: m.export_embed_shard,
                            value: interaction.guild!.shardId.toString(),
                        },
                        {
                            name: m.export_embed_date,
                            value: new Date().toLocaleString(),
                        }
                    ]
                }

                ],
                files: [
                    {
                        name: `queue_export_${interaction.user.id}.json`,
                        attachment: Buffer.from(json)
                    },
                ]
            })
        } catch (e) {
            await interaction.editReply({ embeds: [getRedEmbed(m.export_error)]})
            return;
        }

        await interaction.editReply({
            embeds: [
                {
                    color: 0x780aff,
                    description: m.export_success
                },
        ]})
    }
    override name(): string {
        return "export";
    }

    override description(): string {
        return "Export the current queue into a JSON file";
    }

    override options(): CommandOption[] {
        return [
            {
                name: "test",
                description: "test",
                type: ApplicationCommandOptionType.String,
                required: false,
                choices: [
                    { name: "test2", value: "test2" },
                    { name: "test3", value: "test3" }
                ]
            }
        ];
    }

    override DMUsable(): boolean {
        return false;
    }
}
