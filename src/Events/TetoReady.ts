import { Discord, Once } from "discordx";
import type { ArgsOf, Client } from "discordx";
import chalk from "chalk";
import { ActivityType } from "discord.js";

@Discord()
export class TetoReady {
  @Once({ event: "ready" })
  async onReady([_]: ArgsOf<"ready">, client: Client) {
    await client
      .clearApplicationCommands()
      .then(() => console.log(`${chalk.blue("[Bot Log]")}: Clearing Old Command...`));

    await client.guilds.fetch();
    await client.initApplicationCommands();

    client.user?.setActivity("video syur", {
      type: ActivityType.Watching,
    });

    console.log(`${chalk.greenBright("[Bot Status]")}: ${client.user?.tag} Active!`);
  }
}
