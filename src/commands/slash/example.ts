import { CommandInteraction, Client } from 'discord.js';

export const run = async (client: Client, interaction: CommandInteraction) => {
  // Your slash command logic here
  await interaction.reply('Hello, this is a slash command response!');
};

export const config = {
  name: 'hello', // The name of your slash command
  description: 'Say hello with this command', // The description of your command
};