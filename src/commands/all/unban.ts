import { CommandInteraction, Guild, GuildMember, MessageEmbed, User } from "discord.js";
import { CustomClient } from "../../types/client";
import { Command } from "../../types/command";
import { Util } from "../../util";

module.exports = class UnbanCommand extends Command {
	public constructor(client: CustomClient) {
		super(client, {
			name: "unban",
			description: "Unban a user",
			defaultPermission: false,
			options: [
				{
					name: "user",
					description: "The user to unban (you can also use user ids)",
					type: "USER",
					required: true
				},
				{
					name: "reason",
					description: "The reason to unban the user",
					type: "STRING",
					required: true
				}
			]
		});
	}

	public async run(interaction: CommandInteraction){
		if(!(interaction.member as GuildMember).permissions.has("BAN_MEMBERS")){
			return await Util.sendEmbed(interaction, new MessageEmbed({
				color: "RED",
				title: "No permission",
				description: "You need the `BAN_MEMBERS` permission to use this command"
			}));
		}
		const guild = interaction.guild as Guild;
		const user = interaction.options[0].user as User;
		try {
			await guild.bans.fetch(user);
			const reason = interaction.options[1].value as string;
			await guild.members.unban(user, `${reason} (${interaction.user.id}, ${interaction.user.tag})`);
			await Util.sendEmbed(interaction, new MessageEmbed({
				color: "GREEN",
				title: "User unbanned",
				description: `${user} got unbanned by ${interaction.user}`
			}));
		} catch (error) {
			await Util.sendEmbed(interaction, new MessageEmbed({
				color: "RED",
				title: "User not banned",
				description: "This user has not been banned in this guild"
			}));
		}
	}
};