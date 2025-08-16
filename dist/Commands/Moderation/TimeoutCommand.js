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
import { Discord, Slash, SimpleCommand, SimpleCommandOptionType, SimpleCommandMessage, Guard, SlashOption, SimpleCommandOption, } from "discordx";
import { Category, PermissionGuard } from "@discordx/utilities";
import { CommandInteraction, ApplicationCommandOptionType, GuildMember, EmbedBuilder, } from "discord.js";
import ms from "ms";
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
let TimeoutCommand = class TimeoutCommand {
    async TimeoutSlash(mentionable, duration, reason, interaction) {
        let halah = reason ?? "No reason provided.";
        let msDur;
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
        }
        else {
            msDur = ms(duration) ?? undefined;
        }
        if (!msDur)
            return interaction.reply({
                embeds: [
                    ermsg.setDescription("❌ Invalid duration format. Use `1d`, `1h`, `1m`, `1s`, or a plain number (seconds)."),
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
                        .setDescription(`${mentionable.user.tag} has been timed out for **${ms(msDur, { long: true })}**.\nReason: ${halah}`)
                        .setColor("Green")
                        .setTitle("⏳ User timeouted")
                        .setTimestamp(),
                ],
            });
        }
        catch (error) {
            await interaction.reply({
                embeds: [ermsg.setDescription("❌ Failed to timeout user. Check my permissions.")],
            });
        }
    }
    async TimeoutMessage(mentionable, duration, reason, command) {
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
        let msDur;
        if (/^\d+$/.test(duration)) {
            msDur = Number(duration) * 1000;
        }
        else {
            msDur = ms(duration) ?? undefined;
        }
        if (!msDur)
            return command.message.reply({
                embeds: [
                    ermsg.setDescription("❌ Invalid duration format. Use `1d`, `1h`, `1m`, `1s`, or a plain number (seconds)."),
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
                        .setDescription(`${mentionable.user.tag} has been timed out for **${ms(msDur, { long: true })}**.\nReason: ${halah}`)
                        .setColor("Green")
                        .setTitle("⏳ User timeouted")
                        .setTimestamp(),
                ],
            });
        }
        catch (error) {
            await command.message.reply({
                embeds: [ermsg.setDescription("❌ Failed to timeout user. Check my permissions.")],
            });
        }
    }
};
__decorate([
    Slash({ name: "timeout", description: "Timeout user" }),
    __param(0, SlashOption({
        name: "user",
        description: "user",
        type: ApplicationCommandOptionType.User,
        required: true,
    })),
    __param(1, SlashOption({
        name: "duration",
        description: "duration. use 1d, 1h, 1m, 1s",
        type: ApplicationCommandOptionType.String,
        required: true,
    })),
    __param(2, SlashOption({
        name: "reason",
        description: "reason",
        type: ApplicationCommandOptionType.String,
        required: false,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GuildMember, String, String, CommandInteraction]),
    __metadata("design:returntype", Promise)
], TimeoutCommand.prototype, "TimeoutSlash", null);
__decorate([
    SimpleCommand({ aliases: ["to"], name: "timeout" }),
    __param(0, SimpleCommandOption({
        name: "user",
        type: SimpleCommandOptionType.User,
    })),
    __param(1, SimpleCommandOption({
        name: "duration",
        type: SimpleCommandOptionType.String,
    })),
    __param(2, SimpleCommandOption({
        name: "reason",
        type: SimpleCommandOptionType.String,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GuildMember, String, String, SimpleCommandMessage]),
    __metadata("design:returntype", Promise)
], TimeoutCommand.prototype, "TimeoutMessage", null);
TimeoutCommand = __decorate([
    Discord(),
    Category("Moderation Command"),
    Guard(PermissionGuard(["ModerateMembers"], {
        embeds: [ermsg],
    }))
], TimeoutCommand);
export { TimeoutCommand };
