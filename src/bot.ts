import * as dotenv from "dotenv";
import { Client, DMChannel, MessageEmbed, WebhookClient } from "discord.js";

dotenv.config();

process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const client = new Client();

const setStats = async () => {
	const {STATS_WEBHOOK_ID, STATS_WEBHOOK_TOKEN, STATS_CHANNEL_ID} = process.env;

	if(!STATS_WEBHOOK_ID || !STATS_WEBHOOK_TOKEN || !STATS_CHANNEL_ID) return console.warn("Stats config has not been set");

	const channel = await client.channels.fetch(STATS_CHANNEL_ID);

	if(!channel || !channel.isText() || channel instanceof DMChannel) return console.warn("Invalid stats channel");

	const guild = channel.guild;
	const members = await guild.members.fetch();

	const sentMessage = await new WebhookClient(STATS_WEBHOOK_ID, STATS_WEBHOOK_TOKEN).send({
		avatarURL: client.user?.displayAvatarURL(),
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

client
	.on("ready", async () => {
		await setStats();
		console.log(`${client.user?.username} is ready`);
	})
	.on("guildMemberAdd", async () => await setStats())
	.on("guildMemberRemove", async () => await setStats())
	.on("channelCreate", async () => await setStats())
	.on("channelDelete", async () => await setStats())
	.on("emojiCreate", async () => await setStats())
	.on("emojiDelete", async () => await setStats())
	.on("roleCreate", async () => await setStats())
	.on("roleDelete", async () => await setStats());

client.login(process.env.BOT_TOKEN);