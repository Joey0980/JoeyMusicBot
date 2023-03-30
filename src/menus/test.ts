import { MessageMenu, Bot} from "../classes/Bot";
import {
    MessageContextMenuCommandInteraction,
    ContextMenuCommandType,
    ApplicationCommandType,
} from "discord.js";

export default class TestMenu extends MessageMenu {
    override async run(interaction: MessageContextMenuCommandInteraction, bot: Bot): Promise<void> {
        await interaction.reply("Test");
    }

    override name(): string {
        return "Test";
    }

    override type(): ContextMenuCommandType {
        return ApplicationCommandType.Message
    }
}