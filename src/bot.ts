import * as dotenv from "dotenv";
import { Client, DMChannel, MessageEmbed, NewsChannel, TextChannel } from "discord.js";

dotenv.config();

process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const client = new Client();

let channel: TextChannel | NewsChannel;

const setStats = async (channel: TextChannel | NewsChannel) => {
	const guild = channel.guild;
	const members = await guild.members.fetch();
	const sentMessage = await channel.send(new MessageEmbed({
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
	}));
	for(const message of (await channel.messages.fetch({before: sentMessage.id})).values()){
		if(message.deletable) await message.delete();
	}
};

client
	.on("ready", async () => {
		if(!process.env.STATS_CHANNEL_ID) process.exit();
		const fetchedChannel = await client.channels.fetch(process.env.STATS_CHANNEL_ID);
		if(!fetchedChannel || !fetchedChannel.isText() || fetchedChannel instanceof DMChannel) process.exit();
		channel = fetchedChannel;
		await setStats(channel);
		console.log(`${client.user?.username} is ready`);
	})
	.on("guildMemberAdd", async () => await setStats(channel))
	.on("guildMemberRemove", async () => await setStats(channel))
	.on("channelCreate", async () => await setStats(channel))
	.on("channelDelete", async () => await setStats(channel))
	.on("emojiCreate", async () => await setStats(channel))
	.on("emojiDelete", async () => await setStats(channel))
	.on("roleCreate", async () => await setStats(channel))
	.on("roleDelete", async () => await setStats(channel));

client.login(process.env.BOT_TOKEN);