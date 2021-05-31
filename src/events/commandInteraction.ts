import { Interaction } from "discord.js";
import { ClientEvent, CustomClient } from "../types/client";

module.exports = class InteractionEvent extends ClientEvent {
	public constructor(client: CustomClient) {
		super(client, "interaction");
	}

	public async run(interaction: Interaction){
		if(!interaction.isCommand()) return;

		const command = this.client.commands.get(interaction.commandName);
		if(!command) return;
		try {
			if(command.defer) await interaction.defer({ephemeral: command.ephemeral});
			command.run(interaction);
			console.log(`${command.options.name} has been executed`);
		} catch (error) {
			console.error(error);
		}
	}
};