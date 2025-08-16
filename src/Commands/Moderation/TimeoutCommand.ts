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
import ms, { StringValue } from "ms";

/**
 * Timeout/Temp mute a user
 *
 * @param user specific user
 * @param duration duration using 1s, 1m, 1h, 1d format
 * @param reason reason
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
export class TimeoutCommand {
  @Slash({ name: "timeout", description: "Timeout user" })
  async TimeoutSlash(
    @SlashOption({
      name: "user",
      description: "user",
      type: ApplicationCommandOptionType.User,
      required: true,
    })
    mentionable: GuildMember,
    @SlashOption({
      name: "duration",
      description: "duration. use 1d, 1h, 1m, 1s",
      type: ApplicationCommandOptionType.String,
      required: true,
    })
    duration: string,
    @SlashOption({
      name: "reason",
      description: "reason",
      type: ApplicationCommandOptionType.String,
      required: false,
    })
    reason: string,
    interaction: CommandInteraction
  ) {
    let halah = reason ?? "No reason provided.";

    let msDur: number | undefined;

    if (mentionable.id === interaction.user.id)
      return interaction.reply({
        embeds: [ermsg.setDescription("❌ Cannot Timeout yourself.")],
      });

    if (!mentionable.moderatable)
      return interaction.reply({
        embeds: [ermsg.setDescription("❌ I can’t timeout that user (check role hierarchy).")],
      });

    if (/^\d+$/.test(duration)) {
      msDur = Number(duration) * 1000;
    } else {
      msDur = ms(duration as StringValue) ?? undefined;
    }

    if (!msDur)
      return interaction.reply({
        embeds: [
          ermsg.setDescription(
            "❌ Invalid duration format. Use `1d`, `1h`, `1m`, `1s`, or a plain number (seconds)."
          ),
        ],
      });

    if (msDur > 28 * 24 * 60 * 60 * 1000)
      return interaction.reply({
        embeds: [ermsg.setDescription("❌ Max timeout: 28 days.")],
      });

    try {
      await mentionable.timeout(msDur, halah);
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${mentionable.user.tag} has been timed out for **${ms(msDur, { long: true })}**.\nReason: ${halah}`
            )
            .setColor("Green")
            .setTitle("⏳ User timeouted")
            .setTimestamp(),
        ],
      });
    } catch (error) {
      await interaction.reply({
        embeds: [ermsg.setDescription("❌ Failed to timeout user. Check my permissions.")],
      });
    }
  }

  @SimpleCommand({ aliases: ["to"], name: "timeout" })
  async TimeoutMessage(
    @SimpleCommandOption({
      name: "user",
      type: SimpleCommandOptionType.User,
    })
    mentionable: GuildMember,
    @SimpleCommandOption({
      name: "duration",
      type: SimpleCommandOptionType.String,
    })
    duration: string,
    @SimpleCommandOption({
      name: "reason",
      type: SimpleCommandOptionType.String,
    })
    reason: string,
    command: SimpleCommandMessage
  ) {
    let halah = reason ?? "No reason provided.";

    if (!mentionable)
      return command.message.reply({
        embeds: [ermsg.setDescription("❌ Invalid command format. Please mention a valid user.")],
      });

    if (mentionable.id === command.message.author.id)
      return command.message.reply({
        embeds: [ermsg.setDescription("❌ Cannot Timeout yourself.")],
      });

    if (!mentionable.moderatable)
      return command.message.reply({
        embeds: [ermsg.setDescription("❌ I can’t timeout that user (check role hierarchy).")],
      });

    if (!duration)
      return command.message.reply({
        embeds: [ermsg.setDescription("❌ Invalid command format. Please provide duration.")],
      });

    let msDur: number | undefined;

    if (/^\d+$/.test(duration)) {
      msDur = Number(duration) * 1000;
    } else {
      msDur = ms(duration as StringValue) ?? undefined;
    }

    if (!msDur)
      return command.message.reply({
        embeds: [
          ermsg.setDescription(
            "❌ Invalid duration format. Use `1d`, `1h`, `1m`, `1s`, or a plain number (seconds)."
          ),
        ],
      });

    if (msDur > 28 * 24 * 60 * 60 * 1000)
      return command.message.reply({
        embeds: [ermsg.setDescription("❌ Max timeout: 28 days.")],
      });

    try {
      await mentionable.timeout(msDur, halah);
      await command.message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(
              `${mentionable.user.tag} has been timed out for **${ms(msDur, { long: true })}**.\nReason: ${halah}`
            )
            .setColor("Green")
            .setTitle("⏳ User timeouted")
            .setTimestamp(),
        ],
      });
    } catch (error) {
      await command.message.reply({
        embeds: [ermsg.setDescription("❌ Failed to timeout user. Check my permissions.")],
      });
    }
  }
}
