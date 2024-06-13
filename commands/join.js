const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('join')
    .setDescription('Připojí bota k hlasovému kanálu.'),
  async execute(interaction) {
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel)
      return interaction.reply({ content: 'Nejsi v hlasovém kanálu!', ephemeral: true });

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    return interaction.reply({ content: `Připojeno k: ${voiceChannel.name}`, ephemeral: true });
  },
};
