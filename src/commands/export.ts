import {Command, CommandOption, Bot, CommandPermissions} from "../classes/Bot";
import {ApplicationCommandOptionType, ChatInputCommandInteraction} from "discord.js";
import {getRedEmbed, validateMusicUser,} from "../classes/Music";
import i18nInterface from "../i18n/i18nInterface";

export default class extends Command {
    override async run(interaction: ChatInputCommandInteraction, bot: Bot,  i18n: i18nInterface): Promise<void> {
        await interaction.deferReply();

        if (!validateMusicUser(interaction, i18n, true)) return;

        let queue = Bot.distube!.getQueue(interaction.guild!.id);
        if (!queue) {
            await interaction.editReply({ embeds: [getRedEmbed( i18n.default.queue_empty)]})
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
                    title:  i18n.default.export_embed_title,
                    url: interaction.channel!.url,
                    fields: [
                        {
                            name:  i18n.default.export_embed_guild,
                            value: `${interaction.guild!.name} (${interaction.guild!.id})`,
                        },
                        {
                            name:  i18n.default.export_embed_shard,
                            value: interaction.guild!.shardId.toString(),
                        },
                        {
                            name:  i18n.default.export_embed_date,
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
            await interaction.editReply({ embeds: [getRedEmbed( i18n.default.export_error)]})
            return;
        }

        await interaction.editReply({
            embeds: [
                {
                    color: 0x780aff,
                    description:  i18n.default.export_success
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

    override permissions(): CommandPermissions {
        return {
            dmUsable: false,
            adminPermissionBypass: true
        }
    }
}
