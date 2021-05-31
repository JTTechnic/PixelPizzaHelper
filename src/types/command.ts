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
	public readonly global: boolean;
	public readonly guilds: GuildResolvable[];
	public options: ApplicationCommandData;

	public constructor(client: CustomClient, commandOptions: ApplicationCommandData, options: {
		defer?: boolean;
		ephemeral?: boolean;
		global?: boolean;
		guilds?: GuildResolvable[];
	} = {
		defer: true,
		ephemeral: false,
		global: true,
		guilds: undefined
	}) {
		options.guilds = options.guilds ?? (process.env.MAIN_GUILD ? [process.env.MAIN_GUILD] : undefined);
		this.client = client;
		this.defer = options.defer ?? true;
		this.ephemeral = options.ephemeral ?? false;
		this.global = options.global ?? true;
		this.guilds = options.global ? [] : (options.guilds ?? []);
		this.options = commandOptions;
	}

	public async updateCommand(){
		const client = this.client, options = this.options;
		if(this.global && client.application){
			const command = (await client.application.commands.fetch()).find(command => command.name === options.name);
			if(command) await command.edit(options);
		}
		for(const guild of this.getGuilds()){
			const guildCommand = (await guild.commands.fetch()).find(command => command.name === options.name);
			if(guildCommand) await guildCommand.edit(options);
		}
	}

	public getGuilds(): Guild[] {
		return this.guilds.map(guildResolvable => this.client.guilds.resolve(guildResolvable)).filter(guild => guild !== null) as Guild[];
	}

	public abstract run(interaction: CommandInteraction): void;
}

export {
	Command
};