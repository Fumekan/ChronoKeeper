const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, entersState } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Přehraje písničku z URL.')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('URL YouTube videa')
        .setRequired(true)),
  async execute(interaction) {
    const url = interaction.options.getString('url');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel)
      return interaction.reply({ content: 'Nejsi v hlasovém kanálu!', ephemeral: true });
    if (!ytdl.validateURL(url))
      return interaction.reply({ content: 'Zadej platné YouTube URL!', ephemeral: true });

    const stream = ytdl(url, { filter: 'audioonly' });
    const resource = createAudioResource(stream);

    const player = createAudioPlayer();
        const { WebhookClient } = require('discord.js');

        // Získej token a ID webhooku z konfigurace nebo proměnné prostředí
        const webhookClient = new WebhookClient({ id: 'webhook_id', token: 'webhook_token' });

        webhookClient.send({
                content: 'Došlo k chybě při přehrávání písničky.'
        }).catch(console.error);

    // Chybová manipulace
    player.on('error', error => {
      console.error(`Error: ${error.message}.`);
      interaction.followUp({ content: 'Došlo k chybě při přehrávání písničky.' }); // Informování uživatele o chybě
      player.stop();
    });

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    connection.subscribe(player);
    player.play(resource);

    // Čekání na stav 'playing', aby bylo možné reagovat na chyby při spuštění
    try {
      await entersState(player, AudioPlayerStatus.Playing, 5_000);
      interaction.reply({ content: `Přehrávám: ${url}` });
    } catch (error) {
      console.error(error);
      interaction.reply({ content: 'Nemohl jsem začít přehrávat písničku.' });
      connection.destroy();
    }
  },
};
