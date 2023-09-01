import { Client, ContextMenuInteraction } from 'discord.js';

const config = {
  name: 'test',
  data: { name: "test", type:2 },
  type: 2,
   // description: 'This is a context menu command.',
  defaultPermission: true, // Set this to false if you want to manage permissions manually
};

const run = async (client: Client, interaction: ContextMenuInteraction) => {
  // Your context menu command logic here
  console.log(interaction)
  const user = interaction.targetId // Get the user you right-clicked
  await interaction.reply(`You right-clicked on ${user}'s username!`);
};

export { config, run };