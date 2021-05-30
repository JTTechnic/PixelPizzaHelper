import { ClientEvent, CustomClient } from "../types/client";

module.exports = class ChannelCreateEvent extends ClientEvent {
	public constructor(client: CustomClient) {
		super(client, "channelCreate");
	}

	public async run() {
		await this.client.setStats();
	}
};