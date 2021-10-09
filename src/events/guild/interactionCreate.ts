import { Interaction } from 'discord.js';
import { BotClient } from '../../classes';

export default function interactionCreate(
	client: BotClient,
	interaction: Interaction
) {
	if (!interaction.isCommand()) return;

	const cmd = interaction.commandName;
	const command = client.commands.get(cmd);

	if (!command) return;

	command.execute(interaction, cmd);
}
