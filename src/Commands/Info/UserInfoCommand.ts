import { Discord, Slash, SimpleCommand, SimpleCommandMessage, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import {
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  User,
  Role,
  ApplicationCommandOptionType,
} from "discord.js";

@Discord()
@Category("Info Command")
export class UserInfoCommand {
  @Slash({ name: "userinfo", description: "Show information about a user" })
  async UserInfoSlash(
    @SlashOption({
      name: "user",
      description: "The user you want info about",
      required: false,
      type: ApplicationCommandOptionType.User,
    })
    user: User | undefined,
    interaction: CommandInteraction
  ) {
    const target = user ?? interaction.user;
    const member = interaction.guild?.members.cache.get(target.id);

    const roleColor = 0;

    const authorMember = interaction.guild?.members.cache.get(interaction.user.id);
    const baseColor =
      authorMember?.displayColor && authorMember.displayColor !== 0
        ? authorMember.displayColor
        : 0x5865f2;

    const color = roleColor !== 0 ? roleColor : baseColor;

    const roles =
      member?.roles.cache
        .filter((r) => r.id !== interaction.guild?.id)
        .map((r) => r.toString())
        .join(", ") || "None";

    const embed = new EmbedBuilder()
      .setTitle(`${target.username}'s Info`)
      .setThumbnail(target.displayAvatarURL({ size: 256 }))
      .setColor(member?.displayHexColor || "Blurple")
      .addFields(
        { name: "Tag", value: target.tag, inline: true },
        { name: "ID", value: target.id, inline: true },
        { name: "Bot", value: target.bot ? "Yes" : "No", inline: true },
        {
          name: "Joined Server",
          value: member?.joinedAt?.toLocaleDateString() || "N/A",
          inline: true,
        },
        { name: "Account Created", value: target.createdAt.toLocaleDateString(), inline: true },
        { name: "Roles", value: roles, inline: false }
      )
      .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }

  @SimpleCommand({ aliases: ["user"], name: "userinfo" })
  async UserInfoMessage(command: SimpleCommandMessage) {
    const args = command.argString.trim();
    let target: User | undefined;

    if (args) {
      const mention = command.message.mentions.users.first();
      target = mention || command.message.client.users.cache.get(args) || command.message.author;
    } else {
      target = command.message.author;
    }

    const member = command.message.guild?.members.cache.get(target.id);

    const mentionedRole: Role | undefined = command.message.mentions.roles.first();
    const roleColor = mentionedRole?.color ?? 0;

    const authorMember = command.message.guild?.members.cache.get(command.message.author.id);
    const baseColor =
      authorMember?.displayColor && authorMember.displayColor !== 0
        ? authorMember.displayColor
        : 0x5865f2;

    const color = roleColor !== 0 ? roleColor : baseColor;

    const roles =
      member?.roles.cache
        .filter((r) => r.id !== command.message.guild?.id)
        .map((r) => r.toString())
        .join(", ") || "None";

    const embed = new EmbedBuilder()
      .setTitle(`${target.username}'s Info`)
      .setThumbnail(target.displayAvatarURL({ size: 256 }))
      .setColor(member?.displayHexColor || "Blurple")
      .addFields(
        { name: "Tag", value: target.tag, inline: true },
        { name: "ID", value: target.id, inline: true },
        { name: "Bot", value: target.bot ? "Yes" : "No", inline: true },
        {
          name: "Joined Server",
          value: member?.joinedAt?.toLocaleDateString() || "N/A",
          inline: true,
        },
        { name: "Account Created", value: target.createdAt.toLocaleDateString(), inline: true },
        { name: "Roles", value: roles, inline: false }
      )
      .setFooter({
        text: `${command.message.author.tag}`,
        iconURL: command.message.author.displayAvatarURL(),
      })
      .setTimestamp();
    await command.message.reply({ embeds: [embed] });
  }
}
