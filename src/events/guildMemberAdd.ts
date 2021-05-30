import { ClientEvent, CustomClient } from "../types/client";

module.exports = class GuildMemberAddEvent extends ClientEvent {
	public constructor(client: CustomClient) {
		super(client, "guildMemberAdd");
	}

	public async run() {
		await this.client.setStats();
	}
};