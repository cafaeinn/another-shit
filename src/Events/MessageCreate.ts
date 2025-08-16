import { Discord, On } from "discordx";
import type { ArgsOf, Client } from "discordx";

@Discord()
export class MessageCreate {
  @On({ event: "messageCreate" })
  async onMessage([message]: ArgsOf<"messageCreate">, client: Client) {
    await client.executeCommand(message);
  }
}
