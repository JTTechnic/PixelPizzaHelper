import { ClientEvent, CustomClient } from "../types/client";

module.exports = class RoleCreateEvent extends ClientEvent {
	public constructor(client: CustomClient) {
		super(client, "roleCreate");
	}

	public async run() {
		await this.client.setStats();
	}
};