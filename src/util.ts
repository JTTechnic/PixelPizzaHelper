import {CommandInteraction, DMChannel, Message, Permissions, MessageEmbed, TextChannel, NewsChannel, MessageActionRow} from "discord.js";
import {stripIndents} from "common-tags";

/**
 * Utility methods
 */
class Util {
	/**
	 * Reply to an interaction or send a message to a channel
	 *
	 * @param messageOrChannel The interaction to reply to or the channel to send the message to
	 * @param content The message to send
	 * @param options message options
	 * @returns The message that was sent
	 */
	public static sendMessage(messageOrChannel: Message | CommandInteraction | TextChannel | NewsChannel | DMChannel, content: string, options?: {
		components?: MessageActionRow[];
		ephemeral?: boolean;
	}){
		if(messageOrChannel instanceof CommandInteraction){
			return messageOrChannel.replied || messageOrChannel.deferred ? messageOrChannel.editReply(content, {components: options?.components}) : messageOrChannel.reply(content, options);
		}

		return (messageOrChannel instanceof Message ? messageOrChannel.channel : messageOrChannel).send(content, {components: options?.components});
	}

	/**
	 * Reply to an interaction or send an embed to a channel
	 *
	 * @param messageOrChannel The interaction to reply to or the channel to send the embed to
	 * @param embed The embed to send
	 * @param options message options
	 * @returns The message that was sent
	 */
	public static sendEmbed(messageOrChannel: Message | CommandInteraction | TextChannel | NewsChannel | DMChannel, embed: MessageEmbed, options?: {
		components?: MessageActionRow[];
		ephemeral?: boolean;
	}){
		if(messageOrChannel instanceof CommandInteraction){
			return messageOrChannel.replied || messageOrChannel.deferred ? messageOrChannel.editReply({embeds: [embed], components: options?.components}) : messageOrChannel.reply({embeds: [embed], ephemeral: options?.ephemeral, components: options?.components});
		}

		return (messageOrChannel instanceof Message ? messageOrChannel.channel : messageOrChannel).send({embed, components: options?.components});
	}

	/**
	 * Reply to an interaction or send an embed to a channel
	 *
	 * The embed will be converted to a string if the client can't send embeds
	 *
	 * @param messageOrChannel The interaction to reply to or the channel to send the embed or message to
	 * @param embed The embed to send
	 * @param options message options and what to keep of the embed
	 * @returns The message that was sent
	 */
	public static sendEmbedOrMessage(messageOrChannel: Message | CommandInteraction | TextChannel | NewsChannel | DMChannel, embed: MessageEmbed, options?: {
		keep?: {
			title?: boolean;
			description?: boolean;
			fields?: boolean;
			footer?: boolean;
		};
		ephemeral?: boolean;
		components?: MessageActionRow[];
	}){
		options = options ?? {
			keep: {
				title: true,
				description: true,
				fields: false,
				footer: false
			},
			ephemeral: false
		};
		options.keep = options.keep ?? {
			title: true,
			description: true,
			fields: false,
			footer: false
		};
		options.keep.title = options.keep.title ?? true;
		options.keep.description = options.keep.description ?? true;
		options.keep.fields = options.keep.fields ?? false;
		options.keep.footer = options.keep.footer ?? false;
		options.ephemeral = options.ephemeral ?? false;

		// Interactions can always reply with embeds
		if(messageOrChannel instanceof CommandInteraction){
			return this.sendEmbed(messageOrChannel, embed, {
				ephemeral: options.ephemeral,
				components: options.components
			});
		}

		// set if embeds can be sent
		const channel = messageOrChannel instanceof Message ? messageOrChannel.channel : messageOrChannel;
		const embeds = !channel || channel instanceof DMChannel || !channel.guild?.me ? true : channel.permissionsFor(channel.guild.me)?.has(Permissions.FLAGS.EMBED_LINKS) ?? false;
		if(!embeds){
			return this.sendMessage(messageOrChannel, stripIndents`
				${options.keep.title ? `**${embed.title}**` : ""}
				${options.keep.description ? embed.description : ""}
				${options.keep.fields ? embed.fields.map(field => `**${field.name}**\n${field.value}`).join("\n") : ""}
				${options.keep.footer ? (embed.footer?.text || "") : ""}
			`, {
				components: options.components
			});
		}

		return this.sendEmbed(messageOrChannel, embed, {
			components: options.components
		});
	}
}

export {
	Util
};