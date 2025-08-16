import {
  Discord,
  Slash,
  SimpleCommand,
  SimpleCommandOptionType,
  SimpleCommandMessage,
  Guard,
  MetadataStorage,
  SlashOption,
  SlashChoice,
  SimpleCommandOption,
} from "discordx";
import { Category, PermissionGuard } from "@discordx/utilities";
import {
  CommandInteraction,
  ApplicationCommandOptionType,
  GuildMember,
  User,
  Role,
  Guild,
  EmbedBuilder,
} from "discord.js";

const ermsg = new EmbedBuilder()
  .setColor("Red")
  .setDescription("❌ You don’t have permission to use this command.")
  .setTimestamp();

@Discord()
@Category("Moderation Command")
@Guard(
  PermissionGuard(["KickMembers"], {
    embeds: [ermsg],
  })
)
export class BanCommand {
  @Slash({ name: "kick", description: "Kick user" })
  async exampleSlash(
    @SlashOption({
      name: "user",
      description: "user",
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    mentionable: GuildMember,
    @SlashOption({
      name: "reason",
      description: "reason",
      required: false,
      type: ApplicationCommandOptionType.String,
    })
    reason: string,
    interaction: CommandInteraction
  ) {
    const halah = reason || "No reason provided.";

    if (!mentionable)
      return interaction.reply({
        embeds: [
          new EmbedBuilder().setColor("Red").setDescription("❌ Please select a valid user."),
        ],
      });

    if (!mentionable.kickable)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("❌ I cannot kick this user. Do they have a higher role?"),
        ],
      });

    if (mentionable.id === interaction.user.id)
      return interaction.reply({
        embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ Cannot Kick yourself.")],
      });

    try {
      await interaction.guild?.members?.ban(mentionable.id, { reason: halah });

      interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("👢 User Kicked")
            .setDescription(`**${mentionable.user?.tag}** was kicked.\n**Reason:** ${halah}`)
            .setColor("Green")
            .setTimestamp(),
        ],
      });
    } catch (error) {
      console.log(error);
      interaction.reply({
        embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ Failed to kick the user.")],
      });
    }
  }

  @SimpleCommand({ name: "kick" })
  async KickMessage(
    @SimpleCommandOption({
      name: "user",
      type: SimpleCommandOptionType.User,
    })
    mentionable: GuildMember,
    @SimpleCommandOption({
      name: "reason",
      type: SimpleCommandOptionType.String,
    })
    reason: string,
    command: SimpleCommandMessage
  ) {
    const halah = reason || "No reason provided.";

    if (!mentionable)
      return command.message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("❌ Please mention a valid user or provide a valid user ID."),
        ],
      });

    if (!mentionable.kickable)
      return command.message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("❌ I cannot ban this user. Do they have a higher role?"),
        ],
      });

    if (mentionable.id === command.message.author.id)
      return command.message.reply({
        embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ Cannot Kick yourself.")],
      });

    try {
      await command.message.guild?.members?.ban(mentionable.id, { reason: halah });

      command.message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("👢 User Kicked")
            .setDescription(`**${mentionable.user?.tag}** was kicked.\n**Reason:** ${halah}`)
            .setColor("Green")
            .setTimestamp(),
        ],
      });
    } catch (error) {
      console.log(error);
      command.message.reply({
        embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ Failed to kick the user.")],
      });
    }
  }
}
