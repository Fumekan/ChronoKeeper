const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
const config = require('/root/ChronoKeeper/config');
const { generateDependencyReport } = require('@discordjs/voice');

console.log(generateDependencyReport());

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('/root/ChronoKeeper/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`/root/ChronoKeeper/commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log('Bot je připojen a běží!');
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Při provádění tohoto příkazu došlo k chybě.', ephemeral: true });
  }
});

client.login(config.token);
