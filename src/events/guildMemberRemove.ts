import { ClientEvent, CustomClient } from "../types/client";

module.exports = class GuildMemberRemoveEvent extends ClientEvent {
	public constructor(client: CustomClient) {
		super(client, "guildMemberRemove");
	}

	public async run() {
		await this.client.setStats();
	}
};