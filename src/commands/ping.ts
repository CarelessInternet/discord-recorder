import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, Message, MessageEmbed } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Pong man');

export async function execute(interaction: CommandInteraction) {
	const embed = new MessageEmbed()
		.setColor('RANDOM')
		.setTitle('Pinging...')
		.setTimestamp();

	try {
		const message = await interaction.reply({
			embeds: [embed],
			fetchReply: true
		});

		if (message instanceof Message) {
			embed.setTitle('Result:');
			embed.addField('Ping', `⌛ ${interaction.client.ws.ping}ms`);
			embed.addField(
				'Latency',
				`🏓 Roughly ${
					message.createdTimestamp - interaction.createdTimestamp
				}ms`
			);

			message.edit({ embeds: [embed] });
		}
	} catch (err) {
		console.error(err);
		interaction.followUp({
			content: 'An error occured while pinging, please try again later',
			ephemeral: true
		});
	}
}
