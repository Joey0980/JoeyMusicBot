import { Command, CommandOption, Bot, CommandPermissions } from "../classes/Bot";
import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import DB from "../classes/DB";
import i18nInterface from "../i18n/i18nInterface";

export default class extends Command {
    override async run(interaction: ChatInputCommandInteraction, bot: Bot,  i18n: i18nInterface): Promise<void> {
        await interaction.deferReply();


        let subCommandGroup = interaction.options.getSubcommandGroup();

        switch (subCommandGroup) {
            case "roles": {
                let subCommand = interaction.options.getSubcommand();

                switch (subCommand) {
                    case "add": {
                        let role = interaction.options.getRole("role", true);

                        if (await DB.addRole(interaction.guild!.id, role.id)) {
                            await bot.setDJRoles();

                            await interaction.editReply({ embeds: [{ color: 0x780aff, description: i18n.default.dj_role_added.replace("{roleId}", role.id) }]});

                            return;
                        } else {
                            await interaction.editReply({ embeds: [{ color: 0x780aff, description: i18n.default.dj_role_already_added.replace("{roleId}", role.id) }]});
                            return;
                        }

                    }
                    case "remove": {
                        let role = interaction.options.getRole("role", true);

                        if (await DB.removeRole(interaction.guild!.id, role.id)) {
                            await bot.setDJRoles();

                            await interaction.editReply({ embeds: [{ color: 0x780aff, description: i18n.default.dj_role_removed.replace("{roleId}", role.id) }]});

                            return;
                        } else {
                            await interaction.editReply({ embeds: [{ color: 0x780aff, description: i18n.default.dj_role_not_added.replace("{roleId}", role.id) }]});
                            return;
                        }
                    }
                    case "list": {
                        let roles: string[] = await DB.getDJRolesArray(interaction.guild!.id);
                        let enabled: boolean = await DB.getDJModeEnabled(interaction.guild!.id);
                        await interaction.editReply({ embeds: [
                            {
                                color: 0x780aff,
                                description: i18n.default.dj_role_list_preamble + roles.map(r => { return `<@&${r}>`}).join("\n") || i18n.default.dj_role_list_empty,
                                title: enabled ? i18n.default.dj_role_list_embed_title_enabled : i18n.default.dj_role_list_embed_title_disabled
                            }
                        ]});
                    }
                }
            } break;
            case "status": {
                let subCommand = interaction.options.getSubcommand();

                switch (subCommand) {
                    case "enable": {
                        if (await DB.setEnabled(interaction.guild!.id, true)) {
                            await bot.setDJRoles();

                            await interaction.editReply({ embeds: [{ color: 0x780aff, description:  i18n.default.dj_requirement_enabled }]})
                        } else {
                            await interaction.editReply({ embeds: [{ color: 0x780aff, description:  i18n.default.dj_requirement_already_enabled }]})
                        }
                        return
                    }
                    case "disable": {
                        if (await DB.setEnabled(interaction.guild!.id, false)) {
                            await bot.setDJRoles();

                            await interaction.editReply({embeds: [{ color: 0x780aff, description:  i18n.default.dj_requirement_disabled }]})
                        } else {
                            await interaction.editReply({ embeds: [{ color: 0x780aff, description:  i18n.default.dj_requirement_already_disabled }]})
                        }
                        return;
                    }
                }
            } break;
        }
    }
    override name(): string {
        return "dj";
    }

    override description(): string {
        return "Modify the DJ roles";
    }

    override options(): CommandOption[] {
        return [
            {
                name: "roles",
                description: "Edit roles",
                type: ApplicationCommandOptionType.SubcommandGroup,
                options: [
                    {
                        name: "add",
                        description: "Add a role",
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: "role",
                                description: "The role to add",
                                type: ApplicationCommandOptionType.Role,
                                required: true
                            }
                        ]
                    },
                    {
                        name: "remove",
                        description: "Remove a role",
                        type: ApplicationCommandOptionType.Subcommand,
                        options: [
                            {
                                name: "role",
                                description: "The role to remove",
                                type: ApplicationCommandOptionType.Role,
                                required: true
                            }
                        ]
                    },
                    {
                        name: "list",
                        description: "List all roles",
                        type: ApplicationCommandOptionType.Subcommand
                    }
                ]
            },
            {
                name: "status",
                description: "DJ role status",
                type: ApplicationCommandOptionType.SubcommandGroup,
                options: [
                    {
                        name: "enable",
                        description: "Enable DJ role requirement",
                        type: ApplicationCommandOptionType.Subcommand
                    },
                    {
                        name: "disable",
                        description: "Disable DJ role requirement",
                        type: ApplicationCommandOptionType.Subcommand
                    }
                ]
            }
        ];
    }

    override permissions(): CommandPermissions {
        return {
            dmUsable: false,
            adminPermissionBypass: true,
        }
    }
}
