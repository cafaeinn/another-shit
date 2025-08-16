import { Discord, Slash, SimpleCommand, SimpleCommandMessage, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import {
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  User,
  ApplicationCommandOptionType,
} from "discord.js";

/**
 * Menampilkan User Avatar
 *
 * @param user User yang diinginkan
 * @return user avatar
 *
 */

@Discord()
@Category("Info Command")
export class AvatarCommand {
  @Slash({ name: "avatar", description: "Show a user's avatar" })
  async AvatarSlash(
    @SlashOption({
      name: "user",
      description: "The user whose avatar you want to see",
      required: false,
      type: ApplicationCommandOptionType.User,
    })
    user: User | undefined,
    interaction: CommandInteraction
  ) {
    const target = user ?? interaction.user;
    const member = interaction.guild?.members.cache.get(target.id);

    const color =
      member?.displayColor && member.displayColor !== 0 ? member.displayColor : 0x5865f2;

    const embed = new EmbedBuilder()
      .setTitle(`${target.username}'s Avatar`)
      .setColor(color)
      .setImage(target.displayAvatarURL({ size: 4096, extension: "png", forceStatic: false }))
      .setFooter({ text: `Requested by ${interaction.user.username}` });

    await interaction.reply({ embeds: [embed] });
  }

  @SimpleCommand({ aliases: ["ava", "av"], name: "avatar" })
  async AvatarMessage(command: SimpleCommandMessage) {
    const args = command.argString.trim();
    let target: User | undefined;

    if (args) {
      const mention = command.message.mentions.users.first();
      target = mention || command.message.client.users.cache.get(args) || command.message.author;
    } else {
      target = command.message.author;
    }

    const member = command.message.guild?.members.cache.get(target.id);

    const color =
      member?.displayColor && member.displayColor !== 0 ? member.displayColor : 0x5865f2;

    const embed = new EmbedBuilder()
      .setTitle(`${target.username}'s Avatar`)
      .setColor(color)
      .setImage(target.displayAvatarURL({ size: 4096, extension: "png", forceStatic: false }))
      .setFooter({ text: `Requested by ${command.message.author.username}` });

    await command.message.reply({ embeds: [embed] });
  }
}
