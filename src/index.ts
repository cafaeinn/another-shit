import "dotenv/config";
import { Client } from "discordx";
import { dirname, importx } from "@discordx/importer";
import { IntentsBitField } from "discord.js";
import chalk from "chalk";

const teto = new Client({
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});

async function main() {
  const __dirname = dirname(import.meta.url);

  //command
  await importx(`${__dirname}/Commands/**/*.{js, ts}`).then(() =>
    console.log(`${chalk.blue("[Bot Log]")}: Command Loaded!`)
  );

  //event
  await importx(`${__dirname}/Events/**/*.{js, ts}`).then(() =>
    console.log(`${chalk.blue("[Bot Log]")}: Event Loaded!`)
  );

  // Login
  if (!process.env.TOKEN) {
    throw new Error(`${chalk.red("[Teto Error]")}: Token not found in .env file`);
  }

  await teto.login(process.env.TOKEN);
}

main();
