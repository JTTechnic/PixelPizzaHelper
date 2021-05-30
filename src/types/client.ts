import { Client, ClientEvents, DMChannel, MessageEmbed, WebhookClient } from "discord.js";

class CustomClient extends Client {
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