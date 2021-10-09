import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import {
	EndBehaviorType,
	entersState,
	getVoiceConnection,
	joinVoiceChannel,
	VoiceConnectionStatus,
	VoiceReceiver
} from '@discordjs/voice';
import { opus } from 'prism-media';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { resolve } from 'path';

export const data = new SlashCommandBuilder()
	.setName('record')
	.setDescription('record voice');

export async function execute(interaction: CommandInteraction) {
	if (!interaction.guildId) return;

	try {
		await interaction.deferReply();

		let connection = getVoiceConnection(interaction.guildId);

		if (!connection) {
			if (
				interaction.member instanceof GuildMember &&
				interaction.member.voice.channel
			) {
				const channel = interaction.member.voice.channel;

				connection = joinVoiceChannel({
					channelId: channel.id,
					guildId: interaction.guildId,
					selfDeaf: false,
					selfMute: true,
					// different types for some reason, they havent fixed it yet
					// @ts-ignore
					adapterCreator: channel.guild.voiceAdapterCreator
				});
			} else {
				await interaction.followUp({ content: 'join voice channel first' });
				return;
			}
		}

		await entersState(connection, VoiceConnectionStatus.Ready, 20e3);
		const receiver = connection.receiver;

		receiver.speaking.on('start', (userId) => {
			createListeningStream(receiver, userId, interaction);
		});

		interaction.followUp({ content: 'ready!!' });
	} catch (err) {
		console.error(err);
		interaction.followUp({
			content: 'error occured, try again later',
			ephemeral: true
		});
	}
}

function createListeningStream(
	receiver: VoiceReceiver,
	userId: string,
	interaction: CommandInteraction
) {
	const opusStream = receiver.subscribe(userId, {
		end: {
			behavior: EndBehaviorType.AfterSilence,
			duration: 100
		}
	});

	const oggStream = new opus.OggLogicalBitstream({
		opusHead: new opus.OpusHead({
			channelCount: 2,
			sampleRate: 48_000
		}),
		pageSizeControl: {
			maxPackets: 10
		}
	});

	const filename = resolve(
		__dirname,
		`../../recordings/${Date.now()}-${userId}.ogg`
	);
	const out = createWriteStream(filename);

	pipeline(opusStream, oggStream, out, (err) => {
		if (err) {
			console.warn(`error file ${filename} - ${err.message}`);
		} else {
			console.log(`recorded ${filename}`);
			receiver.voiceConnection.destroy();
			interaction.followUp({ files: [filename] });
		}
	});
}
