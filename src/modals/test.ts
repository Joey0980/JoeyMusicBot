import { Modal, Bot } from "../classes/Bot";
import {
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    ModalSubmitInteraction,
    TextInputBuilder,
    TextInputStyle
} from "discord.js";

export default class extends Modal {
    override async run(interaction: ModalSubmitInteraction, bot: Bot): Promise<void> {
        await interaction.reply({
            embeds: [
                {
                    title: "Modal Submitted!"
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
            .setCustomId('myModal')
            .setTitle('My Modal')
            .addComponents(
                new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents(
                        new TextInputBuilder()
                            .setCustomId('test1')
                            .setLabel("aaaaa")
                            .setValue("aaaaa")
                            .setStyle(TextInputStyle.Short)
                    )
            )
    }
}