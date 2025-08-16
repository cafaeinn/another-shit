import { Discord, Slash, SimpleCommand, SimpleCommandMessage } from "discordx";
import { Category } from "@discordx/utilities";
import { CommandInteraction, EmbedBuilder, GuildMember } from "discord.js";

@Discord()
@Category("Info Command")
export class PingCommand {
  @Slash({ name: "ping", description: "Check bot latency" })
  async PingSlash(interaction: CommandInteraction) {
    const sent = await interaction.reply({ content: "Pinging...", fetchReply: true });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    const member = interaction.guild?.members.cache.get(interaction.user.id);
    const color =
      member?.displayColor && member.displayColor !== 0 ? member.displayColor : 0x5865f2;

    const embed = new EmbedBuilder()
      .setTitle("🏓 Pong!")
      .setColor(color)
      .addFields(
        { name: "Bot Latency", value: `${latency}ms`, inline: true },
        { name: "API Latency", value: `${apiLatency}ms`, inline: true }
      )
      .setTimestamp();

    await interaction.editReply({ content: "", embeds: [embed] });
  }

  @SimpleCommand({ name: "ping" })
  async PingMessage(command: SimpleCommandMessage) {
    const sent = await command.message.reply("Pinging...");

    const latency = sent.createdTimestamp - command.message.createdTimestamp;
    const apiLatency = Math.round(command.message.client.ws.ping);

    const member = command.message.guild?.members.cache.get(command.message.author.id);
    const color =
      member?.displayColor && member.displayColor !== 0 ? member.displayColor : 0x5865f2;

    const embed = new EmbedBuilder()
      .setTitle("🏓 Pong!")
      .setColor(color)
      .addFields(
        { name: "Bot Latency", value: `${latency}ms`, inline: true },
        { name: "API Latency", value: `${apiLatency}ms`, inline: true }
      )
      .setTimestamp();

    await sent.edit({ content: "", embeds: [embed] });
  }
}
