import { Discord, On } from "discordx";
import type { Client } from "discordx";
import type { Guild, Interaction } from "discord.js";

@Discord()
export class InteractionCreate {
  @On({ event: "interactionCreate" })
  async onInteraction([interaction]: [Interaction], client: Client) {
    const guild: Guild | null = interaction.guild;

    if (!guild) return;

    await client.executeInteraction(interaction);
  }
}
