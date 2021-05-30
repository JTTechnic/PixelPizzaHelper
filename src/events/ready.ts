import fs = require("fs");
import path = require("path");
import { ClientEvent, CustomClient } from "../types/client";
import { Command } from "../types/command";

module.exports = class ReadyEvent extends ClientEvent {
	public constructor(client: CustomClient) {
		super(client, "ready", true);
	}

	public async run() {
		const {client} = this;

		__dirname = "dist";
		for(const dir of fs.readdirSync(path.join(__dirname, "commands"))){
			const files = fs.readdirSync(path.join(__dirname, `commands/${dir}`)).filter(file => file.endsWith(".js"));
			for(const file of files){
				const command: Command = new (require(`../commands/${dir}/${file}`))(client);
				client.commands.set(command.options.name, command);
			}
		}

		// set all slash commands
		await client.setCommands();
		await client.setStats();
		console.log(`${client.user?.username} is ready`);
	}
};