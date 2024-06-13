const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVoiceConnection } = require('@discordjs/voice');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('Odpojí bota od hlasového kanálu.'),
  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);
    if (connection) {
      connection.destroy();
      interaction.reply({ content: 'Bot byl odpojen od hlasového kanálu.', ephemeral: true });
    } else {
      interaction.reply({ content: 'Nejsem připojen k žádnému hlasovému kanálu.', ephemeral: true });
    }
  },
};
