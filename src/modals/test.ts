import { Modal, Bot } from "../classes/Bot";
import {
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    ModalSubmitInteraction,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";

export default class extends Modal {
    override async run(interaction: ModalSubmitInteraction, bot: Bot): Promise<void> {
        await interaction.reply({
            embeds: [
                {
                    title: "Modal Submitted!",
                    description: "Here's what you typed!\n" + interaction.fields.getTextInputValue("test1")
                }
            ]
        });
    }

    override name(): string {
        return "Test";
    }

    override id(): string {
        return "test";
    }

    override build(): ModalBuilder {
         return new ModalBuilder()
            .setCustomId(this.id())
            .setTitle(this.name())
            .addComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId("test1")
                            .setLabel("type something")
                            .setValue("something!!!")
                            .setStyle(TextInputStyle.Short)
                            .setRequired(true)
                    )
            )
    }
}