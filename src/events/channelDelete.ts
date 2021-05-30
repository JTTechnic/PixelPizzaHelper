import { ClientEvent, CustomClient } from "../types/client";

module.exports = class ChannelDeleteEvent extends ClientEvent {
	public constructor(client: CustomClient) {
		super(client, "channelDelete");
	}

	public async run() {
		await this.client.setStats();
	}
};