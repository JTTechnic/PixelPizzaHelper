import { GuildResolvable, ApplicationCommandData, CommandInteraction } from "discord.js";
import { CustomClient } from "./client";

interface Command {
	syncStart?(): Promise<void>;
	sync?(): Promise<void>;
	syncEnd?(): Promise<void>;
}

abstract class Command {
	public readonly client: CustomClient;
	public readonly defer: boolean;
	public readonly empheral: boolean;
	public readonly global: boolean;
	public readonly guilds?: GuildResolvable[];
	public options: ApplicationCommandData;

	public constructor(client: CustomClient, commandOptions: ApplicationCommandData, options: {
		defer?: boolean;
		empheral?: boolean;
		global?: boolean;
		guilds?: GuildResolvable[];
	} = {
		defer: true,
		empheral: false,
		global: true,
		guilds: undefined
	}) {
		options.defer = options.defer ?? true;
		options.empheral = options.empheral ?? false;
		options.global = options.global ?? true;
		options.guilds = options.guilds ?? (process.env.MAIN_GUILD ? [process.env.MAIN_GUILD] : undefined);
		this.client = client;
		this.defer = options.defer;
		this.empheral = options.empheral;
		this.global = options.global;
		this.guilds = options.guilds;
		this.options = commandOptions;
	}

	public async updateCommand(){
		const guilds = this.guilds || [], client = this.client, options = this.options;
		if(this.global && client.application){
			const command = (await client.application.commands.fetch()).find(command => command.name === options.name);
			if(command) await command.edit(options);
		}
		for(const guildResolvable of guilds){
			const guild = client.guilds.resolve(guildResolvable);
			if(!guild) continue;
			const guildCommand = (await guild.commands.fetch()).find(command => command.name === options.name);
			if(guildCommand) await guildCommand.edit(options);
		}
	}

	public abstract run(interaction: CommandInteraction): void;
}

export {
	Command
};