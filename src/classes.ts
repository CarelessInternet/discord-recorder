import { Client, ClientOptions, Collection } from 'discord.js';

export class BotClient extends Client {
	public commands: Collection<string, { execute: Function }>;

	constructor(options: ClientOptions) {
		super(options);

		this.commands = new Collection();
	}
}
