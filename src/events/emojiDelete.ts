import { ClientEvent, CustomClient } from "../types/client";

module.exports = class EmojiDeleteEvent extends ClientEvent {
	public constructor(client: CustomClient) {
		super(client, "emojiDelete");
	}

	public async run() {
		await this.client.setStats();
	}
};