import * as colorette from 'colorette';
import { Client, Intents, Collection } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import fs from 'graceful-fs';
import path from 'path';
import resolve from './tools/resolve'

class CustomClient extends Client {
  slash = new Collection()
  context = new Collection()
}

class Bot {
  private token: string;
  private userId?: string;
  private cache?: Map<any, any>;
  private client: Client;

  constructor(options: { token: string; userId?: string; cache?: boolean }) {
    const { token, cache, userId } = options;

    if (!token) {
      throw new Error(colorette.red("You need to enter a bot token to connect to the Discord API."));
    }

    this.token = token;
    if (cache) {
      this.cache = new Map();
    }
    this.userId = userId;
    this.client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });
	this.client.users.resolve = resolve;
	this.client.contexts = new Collection()
	this.client.slashs = new Collection()
  }

  async confirm(callback?: Function) {
    try {
      const token = this.token;
      await this.client.login(token);

      if (callback) {
        callback(this.client);
      }
    } catch (err) {
      throw new Error(
        colorette.redBright("[DISCORD]:") + colorette.yellow(err)
      );
    }
  }

async loadCommandsAndEvents() {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const commandsFolder = path.join(__dirname, 'commands/slash');
  const ctxCommands = path.join(__dirname, 'commands/context')
  const eventsFolder = path.join(__dirname, 'events');

  try {
    const commandFiles = fs.readdirSync(commandsFolder).filter(file => file.endsWith('.ts'));

    for (const file of commandFiles) {
      const commandPath = path.join(commandsFolder, file);
      const command = await import(commandPath);
      if (command.run && command.config) {
        this.client.slashs.set(command.config.name, command);
        console.log('Loaded slash command:', command.config.name);
      }
    }

   const ctxcommandFiles = fs.readdirSync(ctxCommands).filter(file => file.endsWith('.ts'));

    for (const file of ctxcommandFiles) {
      const contextcommandPath = path.join(ctxCommands, file);
      const contextcommand = await import(contextcommandPath);
      if (contextcommand.run && contextcommand.config) {
        this.client.contexts.set(contextcommand.config.name, contextcommand);
        console.log('Loaded context command:', contextcommand.config.name);
      }
	}

    const eventFiles = fs.readdirSync(eventsFolder).filter(file => file.endsWith('.ts'));

    for (const file of eventFiles) {
      const eventPath = path.join(eventsFolder, file);
      const event = await import(eventPath);
      if (event.execute && event.name) {
        this.client.on(event.name, event.execute.bind(null, this.client));
        console.log('Loaded event:', event.name);
      }
    }
  } catch (err) {
    console.error('Error reading commands or events folder:', err);
  }
}

async init() {
  await this.loadCommandsAndEvents();

  const rest = new REST({ version: '10' }).setToken(this.token);

  console.log(colorette.greenBright("[DISCORD]:") + colorette.blue(" Started Sync."));
  const commandsAndContexts = [
    ...this.client.slashs.map(command => command.config),
    ...this.client.contexts.map(c => c.config),
  ];
// @ts-ignore
  await rest.put(
    Routes.applicationCommands(this.userId),
    { body: commandsAndContexts },
  );

  console.log(colorette.greenBright("[DISCORD]:") + colorette.blue(" Successfully reloaded application (/) commands."));
}

  start() {
    (async () => {
      await this.init();
      await this.confirm();
    })();
  }
}

export { Bot };