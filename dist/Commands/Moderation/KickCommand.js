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
const ermsg = new EmbedBuilder()
    .setColor("Red")
    .setDescription("❌ You don’t have permission to use this command.")
    .setTimestamp();
let BanCommand = class BanCommand {
    async exampleSlash(mentionable, reason, interaction) {
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
        }
        catch (error) {
            console.log(error);
            interaction.reply({
                embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ Failed to kick the user.")],
            });
        }
    }
    async KickMessage(mentionable, reason, command) {
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
        }
        catch (error) {
            console.log(error);
            command.message.reply({
                embeds: [new EmbedBuilder().setColor("Red").setDescription("❌ Failed to kick the user.")],
            });
        }
    }
};
__decorate([
    Slash({ name: "kick", description: "Kick user" }),
    __param(0, SlashOption({
        name: "user",
        description: "user",
        type: ApplicationCommandOptionType.User,
        required: true,
    })),
    __param(1, SlashOption({
        name: "reason",
        description: "reason",
        required: false,
        type: ApplicationCommandOptionType.String,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GuildMember, String, CommandInteraction]),
    __metadata("design:returntype", Promise)
], BanCommand.prototype, "exampleSlash", null);
__decorate([
    SimpleCommand({ name: "kick" }),
    __param(0, SimpleCommandOption({
        name: "user",
        type: SimpleCommandOptionType.User,
    })),
    __param(1, SimpleCommandOption({
        name: "reason",
        type: SimpleCommandOptionType.String,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GuildMember, String, SimpleCommandMessage]),
    __metadata("design:returntype", Promise)
], BanCommand.prototype, "KickMessage", null);
BanCommand = __decorate([
    Discord(),
    Category("Moderation Command"),
    Guard(PermissionGuard(["KickMembers"], {
        embeds: [ermsg],
    }))
], BanCommand);
export { BanCommand };
