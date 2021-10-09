import { BotClient } from '../../classes';

export default function ready(client: BotClient) {
	client.user?.setActivity('dead', { type: 'PLAYING' });
	console.log(`Logged in as ${client.user?.tag}`);
}
