import { readdirSync } from 'fs';
import { resolve } from 'path';
import { BotClient } from '../classes';

export default function commandHandler(client: BotClient) {
	const files = readdirSync(resolve(__dirname, '../commands/')).filter((file) =>
		file.endsWith('.js')
	);

	files.forEach(async (file) => {
		const command = await import(`../commands/${file}`);
		client.commands.set(command.data.name, command);
	});
}
