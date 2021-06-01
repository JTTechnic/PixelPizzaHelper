import { GuildResolvable, ApplicationCommandData, CommandInteraction, Guild } from "discord.js";
import { CustomClient } from "./client";

interface Command {
	syncStart?(): Promise<void>;
	sync?(): Promise<void>;
	syncEnd?(): Promise<void>;
}

abstract class Command {
	public readonly client: CustomClient;
	public readonly defer: boolean;
	public readonly ephemeral: boolean;
	public options: ApplicationCommandData;

	public constructor(client: CustomClient, commandOptions: ApplicationCommandData, options: {
		defer?: boolean;
		ephemeral?: boolean;
	} = {
		defer: true,
		ephemeral: false
	}) {
		this.client = client;
		this.defer = options.defer ?? true;
		this.ephemeral = options.ephemeral ?? false;
		this.options = commandOptions;
	}

	public async updateCommand(){
		const client = this.client, options = this.options;
		const command = (await client.guild.commands.fetch()).find(command => command.name === options.name);
		if(command) await command.edit(options);
	}

	public abstract run(interaction: CommandInteraction): void;
}

export {
	Command
};