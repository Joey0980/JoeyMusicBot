import {Command, CommandOption, Bot, CommandPermissions} from "../classes/Bot";
import {ChatInputCommandInteraction} from "discord.js";
import i18nInterface from "../i18n/i18nInterface";

export default class extends Command {
    override async run(interaction: ChatInputCommandInteraction, bot: Bot,  i18n: i18nInterface): Promise<void> {

    }
    override name(): string {
        return "splice";
    }

    override description(): string {
        return "Remove a song at a specific index";
    }

    override options(): CommandOption[] {
        return []
    }

    override permissions(): CommandPermissions {
        return {
            dmUsable: false,
            adminPermissionBypass: true,
            DJRole: true
        }
    }
}
