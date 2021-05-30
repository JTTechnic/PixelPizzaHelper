import { ClientEvent, CustomClient } from "../types/client";

module.exports = class ReadyEvent extends ClientEvent {
	public constructor(client: CustomClient) {
		super(client, "ready", true);
	}

	public async run() {
		const {client} = this;

		await client.setStats();
		console.log(`${client.user?.username} is ready`);
	}
};