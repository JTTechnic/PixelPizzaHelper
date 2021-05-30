import { ClientEvent, CustomClient } from "../types/client";

module.exports = class RoleDeleteEvent extends ClientEvent {
	public constructor(client: CustomClient) {
		super(client, "roleDelete");
	}

	public async run() {
		await this.client.setStats();
	}
};