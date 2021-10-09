import { Intents } from 'discord.js';
import { BotClient } from './classes';

const client = new BotClient({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES
	],
	partials: ['MESSAGE', 'CHANNEL', 'GUILD_MEMBER'],
	shards: 'auto'
});

['command_handler', 'event_handler'].forEach(async (handler) => {
	const file = await import(`./handlers/${handler}`);
	file.default(client);
});

client.login(process.env.DISCORD_BOT_TOKEN);
