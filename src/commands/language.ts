import { Command, CommandOption, Bot, CommandPermissions } from "../classes/Bot";
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import DB from "../classes/DB";
import i18nInterface from "../i18n/i18nInterface";

export default class extends Command {
    override async run(interaction: ChatInputCommandInteraction, bot: Bot, i18n: i18nInterface): Promise<void> {
        await interaction.deferReply();

        let subCommand = interaction.options.getSubcommand(true);

        switch (subCommand) {
            case "set": {
                let language = interaction.options.getString("language", true);

                if (!bot.localizations.has(language)) {
                    await interaction.editReply({ embeds: [
                        {
                            color: 0xff0000,
                            description: i18n.default.lang_invalid_id
                        }
                    ]});

                    return;
                }

                await DB.setServerLocalization(interaction.guild!.id, language);

                await bot.setLocalizations();

                await interaction.editReply({ embeds: [
                    {
                        color: 0x780aff,
                        description: i18n.default.lang_set.replace("{lang}", bot.localizations.get(language)!.readableName)
                    }
                ]});

                break;
            }
            case "list": {
                let languages = Array.from(bot.localizations.keys());

                languages.sort();

                await interaction.editReply({ embeds: [
                    {
                        color: 0x780aff,
                        title: i18n.default.lang_list_embed_title,
                        fields: [
                            { // field: language ids
                                name: i18n.default.lang_list_embed_field_ids,
                                value: languages.join("\n"),
                                inline: true
                            },
                            {
                                name: i18n.default.lang_list_embed_field_names,
                                value: languages.map(l => { return bot.localizations.get(l)!.readableName }).join("\n"),
                                inline: true
                            }
                        ]
                    }
                ]});

                break;
            }
            case "reset": {
                await DB.setServerLocalization(interaction.guild!.id, "en_US");

                await bot.setLocalizations();

                await interaction.editReply({ embeds: [
                    {
                        color: 0x780aff,
                        description: i18n.default.lang_reset,
                    }
                ]});
            }
        }
    }
    override name(): string {
        return "language";
    }

    override description(): string {
        return "Edit server language";
    }

    override options(): CommandOption[] {
        return [
            {
                name: "set",
                type: ApplicationCommandOptionType.Subcommand,
                description: "Set the server language",
                options: [
                    {
                        name: "language",
                        type: ApplicationCommandOptionType.String,
                        description: "The language ID to set (ex: en-US)",
                    }
                ]
            },
            {
                name: "list",
                type: ApplicationCommandOptionType.Subcommand,
                description: "List all available languages",
            },
            {
                name: "reset",
                type: ApplicationCommandOptionType.Subcommand,
                description: "Reset the server language to the default language",
            }
        ];
    }

    override permissions(): CommandPermissions {
        return {
            dmUsable: false,
            adminPermissionBypass: true,
            DJRole: true
        }
    }
}
