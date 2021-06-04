import { id } from "common-tags";
import { MessageEmbed, VoiceState, WebhookClient } from "discord.js";
import { ClientEvent, CustomClient } from "../types/client";

enum Change {
	unknown = 0,
	change = 1,
	leave = 2,
	join = 3
}

module.exports = class VoiceStateUpdateEvent extends ClientEvent {
	public constructor(client: CustomClient) {
		super(client, "voiceStateUpdate");
	}

	public async run(oldState: VoiceState, newState: VoiceState){
		const {VOICE_WEBHOOK_ID, VOICE_WEBHOOK_TOKEN} = process.env;
		if(!VOICE_WEBHOOK_ID || !VOICE_WEBHOOK_TOKEN) return;

		let change = Change.unknown;

		if(oldState.channelID !== newState.channelID){
			change = Change.change;
		}

		if(oldState.channelID && !newState.channelID){
			change = Change.leave;
		}

		if(!oldState.channelID && newState.channelID){
			change = Change.join;
		}

		let embed: MessageEmbed;
		switch(change){
			case Change.change:
				embed = new MessageEmbed({
					color: "BLUE",
					title: "Member changed voice channel",
					fields: [
						{
							name: "Before",
							value: `#${oldState.channel?.name}`
						},
						{
							name: "After",
							value: `#${newState.channel?.name}`
						}
					]
				});
				break;
			case Change.leave:
				embed = new MessageEmbed({
					color: "RED",
					title: "Member left voice channel",
					description: `**${newState.member?.user.tag}** left #${oldState.channel?.name}`
				});
				break;
			case Change.join:
				embed = new MessageEmbed({
					color: "GREEN",
					title: "Member joined voice channel",
					description: `**${newState.member?.user.tag}** joined #${newState.channel?.name}`
				});
				break;
			default: return;
		}

		new WebhookClient(VOICE_WEBHOOK_ID, VOICE_WEBHOOK_TOKEN).send({
			embeds: [
				embed
					.setAuthor(newState.member?.user.tag, newState.member?.user.displayAvatarURL({format: "png"}))
					.setFooter(`ID: ${newState.member?.id}`)
					.setTimestamp(Date.now())
			],
			username: "Pixel Pizza Logging",
			avatarURL: this.client.user?.displayAvatarURL() as string
		});
	}
};