import { ClientEvent, CustomClient } from "../types/client";

module.exports = class EmojiCreateEvent extends ClientEvent {
	public constructor(client: CustomClient) {
		super(client, "emojiCreate");
	}

	public async run() {
		await this.client.setStats();
	}
};