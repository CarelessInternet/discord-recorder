import { Shard, ShardingManager } from 'discord.js';
import { config } from 'dotenv';

config();

const manager = new ShardingManager('./dist/bot.js', {
	token: process.env.DISCORD_BOT_TOKEN
});

manager.on('shardCreate', (shard: Shard) => {
	console.log(`Created shard #${shard.id} at ${new Date().toLocaleString()}`);
});

manager.spawn();
