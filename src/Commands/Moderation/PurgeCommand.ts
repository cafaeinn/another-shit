import {
  Discord,
  Slash,
  SlashOption,
  SlashChoice,
  SimpleCommand,
  SimpleCommandMessage,
  Guard,
  SimpleCommandOption,
  SimpleCommandOptionType,
} from "discordx";
import {
  ApplicationCommandOptionType,
  CommandInteraction,
  TextChannel,
  User,
  PermissionFlagsBits,
  EmbedBuilder,
  GuildMember,
  messageLink,
  Collection,
} from "discord.js";
import { Category, PermissionGuard } from "@discordx/utilities";

/**
 * Bulk delete message
 * @param user purge selected user message
 * @param amount amount to delete
 */

const ermsg = new EmbedBuilder()
  .setColor("Red")
  .setDescription("❌ You don’t have permission to use this command.")
  .setTimestamp();

@Discord()
@Category("Moderation Command")
@Guard(
  PermissionGuard(["ManageMessages"], {
    embeds: [ermsg],
  })
)
export class PurgeCommand {
  @Slash({
    name: "purge",
    description: "Bulk delete messages",
  })
  async PurgeSlash(
    @SlashChoice({ name: "user", value: "user" })
    @SlashChoice({ name: "any", value: "any" })
    @SlashOption({
      name: "option",
      description: "Delete all messages or only from a user",
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    opt: "user" | "any",

    @SlashOption({
      name: "amount",
      description: "How many messages to scan (max 100)",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    })
    amount: number,

    @SlashOption({
      name: "target",
      description: "User to purge messages from (required if option = user)",
      type: ApplicationCommandOptionType.User,
      required: false,
    })
    target: User | undefined,

    interaction: CommandInteraction
  ) {
    const channel = interaction.channel as TextChannel;

    try {
      const messages = await channel.messages.fetch({ limit: amount });

      let toDelete;
      if (opt === "any") {
        toDelete = messages;
      } else {
        if (!target) {
          const errorEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("❌ You must specify a user when using `option: user`.");
          await interaction.reply({ embeds: [errorEmbed] });
          return;
        }
        toDelete = messages.filter((m) => m.author.id === target.id);
      }

      await channel.bulkDelete(toDelete, true);

      const successEmbed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("🧹 Messages Purged")
        .setDescription(
          `✅ Deleted **${toDelete.size}** messages ${
            opt === "user" ? `from **${target?.tag}**` : "from this channel"
          }.`
        )
        .setFooter({ text: `Requested by ${interaction.user.tag}` })
        .setTimestamp();

      await interaction.reply({ embeds: [successEmbed] });
    } catch (err) {
      console.error(err);
      const errorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("❌ Purge Failed")
        .setDescription(
          "Make sure I have **Manage Messages** permission and the messages are not older than 14 days."
        );

      await interaction.reply({ embeds: [errorEmbed] });
    }
  }

  // Optional prefix command version
  @SimpleCommand({ name: "purge" })
  async PurgeMessage(
    @SimpleCommandOption({
      name: "user",
      type: SimpleCommandOptionType.User,
    })
    mentionable: GuildMember | undefined,

    @SimpleCommandOption({
      name: "amount",
      type: SimpleCommandOptionType.Number,
    })
    amount: number | undefined,

    command: SimpleCommandMessage
  ) {
    const channel = command.message.channel as TextChannel;

    try {
      const fetchLimit = amount ?? 100;
      const messages = await channel.messages.fetch({ limit: fetchLimit });

      let toDelete: Collection<string, any> = new Collection();

      if (!mentionable) {
        toDelete = messages;
      } else {
        const filtered = messages.filter((m) => m.author.id === mentionable.id);
        if (!amount) {
          toDelete = filtered;
        } else {
          toDelete = new Collection(filtered.first(amount).map((m) => [m.id, m]));
        }
      }

      // Filter out messages older than 14 days
      const now = Date.now();
      toDelete = toDelete.filter((m) => now - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000);

      if (!toDelete.size) {
        const emptyEmbed = new EmbedBuilder()
          .setColor("Yellow")
          .setDescription("⚠️ No messages could be deleted (maybe too old or none found).");
        await command.message.reply({ embeds: [emptyEmbed] });
        return;
      }

      await channel.bulkDelete(toDelete, true);

      const successEmbed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("🧹 Messages Purged")
        .setDescription(
          `✅ Deleted **${toDelete.size}** messages ${
            mentionable ? `from **${mentionable.user.tag}**` : "from this channel"
          }.`
        )
        .setFooter({ text: `Requested by ${command.message.author.tag}` })
        .setTimestamp();

      await command.message.reply({ embeds: [successEmbed] });
    } catch (err) {
      console.error(err);
      const errorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("❌ Purge Failed")
        .setDescription(
          "Make sure I have **Manage Messages** permission and the messages are not older than 14 days."
        );

      await command.message.reply({ embeds: [errorEmbed] });
    }
  }
}
