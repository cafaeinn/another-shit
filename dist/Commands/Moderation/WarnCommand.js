var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Discord, Slash, SimpleCommand, SimpleCommandOptionType, SimpleCommandMessage, Guard, SlashOption, SlashChoice, SimpleCommandOption, } from "discordx";
import { Category, PermissionGuard } from "@discordx/utilities";
import { CommandInteraction, ApplicationCommandOptionType, GuildMember, EmbedBuilder, } from "discord.js";
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
let WarnCommand = class WarnCommand {
    async WarnSlash(opt, mentionable, reason, interaction) {
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
        const guildId = interaction.guild.id;
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
                        .setDescription(warnings
                        .map((w, i) => `**#${i + 1}** by <@${w.moderator}> • ${new Date(w.timestamp).toLocaleString()}\nReason: ${w.reason}`)
                        .join("\n\n"))
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
                        .setDescription(`${mentionable} has been warned by ${interaction.user}.\n**Reason:** ${reason}`)
                        .setTimestamp(),
                ],
            });
        }
    }
    async WarnMessage(opt, mentionable, reason, command) {
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
        const guildId = command.message.guild.id;
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
                        .setDescription(warnings
                        .map((w, i) => `**#${i + 1}** by <@${w.moderator}> • ${new Date(w.timestamp).toLocaleString()}\nReason: ${w.reason}`)
                        .join("\n\n"))
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
                        .setDescription(`${mentionable} has been warned by ${command.message.author.tag}.\n**Reason:** ${reason}`)
                        .setTimestamp(),
                ],
            });
        }
    }
};
__decorate([
    Slash({ name: "warn", description: "Warn user." }),
    __param(0, SlashChoice({ name: "check", value: "check" })),
    __param(0, SlashChoice({ name: "user", value: "user" })),
    __param(0, SlashChoice({ name: "clear", value: "clear" })),
    __param(0, SlashOption({
        name: "option",
        description: "option",
        type: ApplicationCommandOptionType.String,
        required: true,
    })),
    __param(1, SlashOption({
        name: "user",
        description: "user",
        required: true,
        type: ApplicationCommandOptionType.User,
    })),
    __param(2, SlashOption({
        name: "reason",
        description: "reason",
        required: false,
        type: ApplicationCommandOptionType.String,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, GuildMember, String, CommandInteraction]),
    __metadata("design:returntype", Promise)
], WarnCommand.prototype, "WarnSlash", null);
__decorate([
    SimpleCommand({ name: "warn" }),
    __param(0, SimpleCommandOption({
        name: "option",
        type: SimpleCommandOptionType.String,
    })),
    __param(1, SimpleCommandOption({
        name: "user",
        type: SimpleCommandOptionType.User,
    })),
    __param(2, SimpleCommandOption({
        name: "reason",
        type: SimpleCommandOptionType.String,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, GuildMember, String, SimpleCommandMessage]),
    __metadata("design:returntype", Promise)
], WarnCommand.prototype, "WarnMessage", null);
WarnCommand = __decorate([
    Discord(),
    Category("Moderation Command"),
    Guard(PermissionGuard(["ModerateMembers"], {
        embeds: [ermsg],
    }))
], WarnCommand);
export { WarnCommand };
