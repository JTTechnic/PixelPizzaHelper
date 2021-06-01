import { ApplicationCommandPermissions, Client, ClientEvents, ClientOptions, Collection, DMChannel, Guild, MessageEmbed, WebhookClient } from "discord.js";
import { Command } from "./command";

class CustomClient extends Client {
	public commands: Collection<string, Command> = new Collection();

	public constructor(options: ClientOptions){
		super(options);
	}

	public get guild(): Guild {
		const {MAIN_GUILD} = process.env;
		if(!MAIN_GUILD){
			console.error("MAIN_GUILD not set");
			process.exit();
		}
		const guild = this.guilds.cache.get(MAIN_GUILD);
		if(!guild){
			console.error("invalid MAIN_GUILD");
			process.exit();
		}
		return guild;
	}

	public async syncCommands(){
		const commands = this.commands;
		// Sync before commands are in discord
		for(const command of commands.values()) {
			console.log(`syncStart ${command.options.name}`);
			await command.syncStart?.();
		}
		// Sync to set commands in discord
		for(const command of commands.values()) {
			console.log(`sync ${command.options.name}`);
			await command.sync?.();
		}
		// Sync after commands are in discord
		for(const command of commands.values()) {
			console.log(`syncEnd ${command.options.name}`);
			await command.syncEnd?.();
		}
		console.log("Done syncing commands");
	}

	public async setCommands(){
		const {commands} = this;

		// sync all commands
		await this.syncCommands();

		// set commands
		for(const command of (await this.guild.commands.set(commands.map(command => command.options))).values()){
			if(!process.env.OWNER_ID) break;
			let permissions: ApplicationCommandPermissions[];
			try {
				permissions = await command.fetchPermissions();
			} catch (error) {
				permissions = [];
			}
			permissions.push({
				id: process.env.OWNER_ID,
				permission: true,
				type: "USER"
			});
			await command.setPermissions(permissions);
		}
	}

	public async setStats(){
		const {STATS_WEBHOOK_ID, STATS_WEBHOOK_TOKEN, STATS_CHANNEL_ID} = process.env;

		if(!STATS_WEBHOOK_ID || !STATS_WEBHOOK_TOKEN || !STATS_CHANNEL_ID) return console.warn("Stats config has not been set");

		const channel = await this.channels.fetch(STATS_CHANNEL_ID);

		if(!channel || !channel.isText() || channel instanceof DMChannel) return console.warn("Invalid stats channel");

		const guild = channel.guild;
		const members = await guild.members.fetch();

		const sentMessage = await new WebhookClient(STATS_WEBHOOK_ID, STATS_WEBHOOK_TOKEN).send({
			avatarURL: this.user?.displayAvatarURL(),
			username: "Pixel Pizza Stats",
			embeds: [
				new MessageEmbed({
					color: "BLUE",
					title: "Bot and server stats",
					fields: [
						{
							name: "All members",
							value: members.size
						},
						{
							name: "Members",
							value: members.filter(member => !member.user.bot).size
						},
						{
							name: "Bots",
							value: members.filter(member => member.user.bot).size
						},
						{
							name: "Categories",
							value: guild.channels.cache.filter(channel => channel.type === "category").size
						},
						{
							name: "Channels",
							value: guild.channels.cache.filter(channel => channel.type !== "category").size
						},
						{
							name: "Roles",
							value: guild.roles.cache.size
						},
						{
							name: "Emojis",
							value: guild.emojis.cache.filter(emoji => !emoji.animated).size
						},
						{
							name: "Animated Emojis",
							value: guild.emojis.cache.filter(emoji => emoji.animated).size
						}
					]
				})
			]
		});

		for(const message of (await channel.messages.fetch({before: sentMessage.id})).values()){
			if(message.deletable) await message.delete();
		}
	};
}

abstract class ClientEvent {
	public readonly client: CustomClient;
	public readonly name: keyof ClientEvents;
	public readonly once: boolean;

	public constructor(client: CustomClient, name: keyof ClientEvents, once?: boolean){
		this.client = client;
		this.name = name;
		this.once = once ?? false;
	}

	public abstract run(...args: any[]): void;
}

export {
	CustomClient,
	ClientEvent
};