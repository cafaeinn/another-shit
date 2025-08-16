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
  SimpleCommandParseType,
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
import { addWarning, getWarning, clearWarnings } from "../../database/couch.js";

/**
 * Warn user
 *
 * @param user add warn to a user
 * @param check check user warn list
 * @param clear clear all user warn
 * @param reason give a reason
 */

const ermsg = new EmbedBuilder()
  .setColor("Red")
  .setDescription("❌ You don’t have permission to use this command.")
  .setTimestamp();

@Discord()
@Category("Moderation Command")
@Guard(
  PermissionGuard(["ModerateMembers"], {
    embeds: [ermsg],
  })
)
export class WarnCommand {
  @Slash({ name: "warn", description: "Warn user." })
  async WarnSlash(
    @SlashChoice({ name: "check", value: "check" })
    @SlashChoice({ name: "user", value: "user" })
    @SlashChoice({ name: "clear", value: "clear" })
    @SlashOption({
      name: "option",
      description: "option",
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    opt: "check" | "user" | "clear",
    @SlashOption({
      name: "user",
      description: "user",
      required: true,
      type: ApplicationCommandOptionType.User,
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
    if (!opt)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("❌ Please provide the option: **user**, **check**, or **clear**."),
        ],
      });

    if (!mentionable)
      return interaction.reply({
        embeds: [
          new EmbedBuilder().setColor("Red").setDescription("❌ Please mention a valid user."),
        ],
      });

    const guildId = interaction.guild!.id;
    const userId = mentionable.id;
    const halah = reason ?? "No reason provided.";

    if (opt === "clear") {
      const removed = await clearWarnings(userId, guildId);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription(`✅ Cleared **${removed}** warnings for <@${userId}>.`)
            .setTimestamp(),
        ],
      });
    }

    if (opt === "check") {
      const warnings = await getWarning(userId, guildId);
      if (!warnings || warnings.length === 0)
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setDescription(`${mentionable} has no warn.`)
              .setTimestamp(),
          ],
        });
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Yellow")
            .setTitle(`⚠️ Warnings for ${mentionable.user.tag ?? mentionable.displayName}.`)
            .setDescription(
              warnings
                .map(
                  (w: any, i: number) =>
                    `**#${i + 1}** by <@${w.moderator}> • ${new Date(w.timestamp).toLocaleString()}\nReason: ${w.reason}`
                )
                .join("\n\n")
            )
            .setFooter({ text: `Total warnings: ${warnings.length}` })
            .setTimestamp(),
        ],
      });
    }

    if (opt === "user") {
      await addWarning(userId, guildId, interaction.user.id, halah);
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setTitle("⚠️ User Warned")
            .setDescription(
              `${mentionable} has been warned by ${interaction.user}.\n**Reason:** ${reason}`
            )
            .setTimestamp(),
        ],
      });
    }
  }

  @SimpleCommand({ name: "warn" })
  async WarnMessage(
    @SimpleCommandOption({
      name: "option",
      type: SimpleCommandOptionType.String,
    })
    opt: string,
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
    if (!opt || !["user", "clear", "check"].includes(opt))
      return command.message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Red")
            .setDescription("❌ Please provide the option: **user**, **check**, or **clear**."),
        ],
      });

    if (!mentionable)
      return command.message.reply({
        embeds: [
          new EmbedBuilder().setColor("Red").setDescription("❌ Please mention a valid user."),
        ],
      });

    const guildId = command.message.guild!.id;
    const userId = mentionable.id;
    const halah = reason ?? "No reason provided.";

    if (opt === "clear") {
      const removed = await clearWarnings(userId, guildId);
      return command.message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setDescription(`✅ Cleared **${removed}** warnings for <@${userId}>.`)
            .setTimestamp(),
        ],
      });
    }

    if (opt === "check") {
      const warnings = await getWarning(userId, guildId);
      if (!warnings || warnings.length === 0)
        return command.message.reply({
          embeds: [
            new EmbedBuilder()
              .setColor("Green")
              .setDescription(`${mentionable} has no warn.`)
              .setTimestamp(),
          ],
        });
      return command.message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Yellow")
            .setTitle(`⚠️ Warnings for ${mentionable.user.tag ?? mentionable.displayName}.`)
            .setDescription(
              warnings
                .map(
                  (w: any, i: number) =>
                    `**#${i + 1}** by <@${w.moderator}> • ${new Date(w.timestamp).toLocaleString()}\nReason: ${w.reason}`
                )
                .join("\n\n")
            )
            .setFooter({ text: `Total warnings: ${warnings.length}` })
            .setTimestamp(),
        ],
      });
    }

    if (opt === "user") {
      await addWarning(userId, guildId, command.message.author.id, halah);
      return command.message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor("Green")
            .setTitle("⚠️ User Warned")
            .setDescription(
              `${mentionable} has been warned by ${command.message.author.tag}.\n**Reason:** ${reason}`
            )
            .setTimestamp(),
        ],
      });
    }
  }
}
