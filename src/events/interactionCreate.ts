import { Client, CommandInteraction } from 'discord.js';

export const name = 'interactionCreate';

export const execute = async (client: Client, interaction: CommandInteraction) => {
  // Your code to handle the interactionCreate event
  const commandName = interaction.commandName;
  const slashCommand = client.slashs.get(commandName);
  const contextCommand = client.contexts.get(commandName);

  try {
    if (slashCommand) {
      await slashCommand.run(client, interaction);
    } else if (contextCommand) {
      await contextCommand.run(client, interaction);
    } else {
      // Neither slash command nor context command found
      return;
    }
  } catch (error) {
    console.error('Error executing command:', error);
    interaction.reply({ content: 'An error occurred while executing this command.', ephemeral: true });
  }
};