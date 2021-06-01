import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { CustomClient } from "../../types/client";
import { Command } from "../../types/command";
import { Util } from "../../util";

module.exports = class KickCommand extends Command {
	public constructor(client: CustomClient) {
		super(client, {
			name: "kick",
			description: "Kick a member",
			defaultPermission: false,
			options: [
				{
					name: "member",
					description: "The member to kick",
					type: "USER",
					required: true
				},
				{
					name: "reason",
					description: "Why this member got kicked",
					type: "STRING",
					required: true
				}
			]
		});
	}

	public async run(interaction: CommandInteraction){
		if(!(interaction.member as GuildMember).permissions.has("KICK_MEMBERS")){
			return await Util.sendEmbed(interaction, new MessageEmbed({
				color: "RED",
				title: "No permission",
				description: "You need the `KICK_MEMBERS` permission to use this command"
			}));
		}
		const member = interaction.options[0].member as GuildMember;
		const reason = interaction.options[1].value as string;
		if(!member.kickable){
			return await Util.sendEmbed(interaction, new MessageEmbed({
				color: "RED",
				title: "Couldn't kick member",
				description: "This member could not be kicked"
			}));
		}
		await member.kick(`${reason} (${interaction.user.id}, ${interaction.user.tag})`);
		await Util.sendEmbed(interaction, new MessageEmbed({
			color: "GREEN",
			title: "Member kicked",
			description: `${member} got kicked by ${interaction.user}`,
			fields: [
				{
					name: "Reason",
					value: reason
				}
			]
		}));
	}
};