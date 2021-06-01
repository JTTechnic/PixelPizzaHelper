import { CommandInteraction, EmbedFieldData, GuildMember, MessageEmbed } from "discord.js";
import { CustomClient } from "../../types/client";
import { Command } from "../../types/command";
import { Util } from "../../util";

module.exports = class BanCommand extends Command {
	public constructor(client: CustomClient){
		super(client, {
			name: "ban",
			description: "Ban or tempban a member",
			defaultPermission: false,
			options: [
				{
					name: "member",
					description: "The member to ban",
					type: "USER",
					required: true
				},
				{
					name: "reason",
					description: "The reason to ban this member",
					type: "STRING",
					required: true
				},
				{
					name: "days",
					description: "The amount of days to ban the member for",
					type: "INTEGER"
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
		const member = interaction.options[0].member as GuildMember;
		const reason = interaction.options[1].value as string;
		const days = interaction.options[2]?.value as number | undefined;
		if(!member.bannable){
			return await Util.sendEmbed(interaction, new MessageEmbed({
				color: "RED",
				title: "Couldn't ban member",
				description: "This member could not be banned"
			}));
		}
		await member.ban({
			reason: `${reason} (${interaction.user.id}, ${interaction.user.tag})`,
			days
		});
		const fields: EmbedFieldData[] = [{
			name: "Reason",
			value: reason
		}];
		if(days) fields.push({
			name: "Days",
			value: days
		});
		await Util.sendEmbed(interaction, new MessageEmbed({
			color: "GREEN",
			title: "Member banned",
			description: `${member} got banned by ${interaction.user}`,
			fields
		}));
	}
};