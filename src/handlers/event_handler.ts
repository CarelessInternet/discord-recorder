import { readdirSync } from 'fs';
import { resolve } from 'path';
import { BotClient } from '../classes';

export default function eventHandler(client: BotClient) {
	const loadDirectories = async (dirs: string) => {
		const files = readdirSync(resolve(__dirname, `../events/${dirs}`)).filter(
			(file) => file.endsWith('.js')
		);
		for (const file of files) {
			const event = await import(`../events/${dirs}/${file}`);
			const name = file.split('.')[0];

			if (name === 'ready') {
				client.once(name, event.default.bind(null, client));
			} else {
				client.on(name, event.default.bind(null, client));
			}
		}
	};

	['client', 'guild'].forEach((dir) => loadDirectories(dir));
}
