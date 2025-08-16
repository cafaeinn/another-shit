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
import { Discord, Slash, SimpleCommand, SimpleCommandMessage, SlashOption } from "discordx";
import { Category } from "@discordx/utilities";
import { CommandInteraction, EmbedBuilder, ApplicationCommandOptionType, } from "discord.js";
let UserInfoCommand = class UserInfoCommand {
    async UserInfoSlash(user, interaction) {
        const target = user ?? interaction.user;
        const member = interaction.guild?.members.cache.get(target.id);
        const roleColor = 0;
        const authorMember = interaction.guild?.members.cache.get(interaction.user.id);
        const baseColor = authorMember?.displayColor && authorMember.displayColor !== 0
            ? authorMember.displayColor
            : 0x5865f2;
        const color = roleColor !== 0 ? roleColor : baseColor;
        const roles = member?.roles.cache
            .filter((r) => r.id !== interaction.guild?.id)
            .map((r) => r.toString())
            .join(", ") || "None";
        const embed = new EmbedBuilder()
            .setTitle(`${target.username}'s Info`)
            .setThumbnail(target.displayAvatarURL({ size: 256 }))
            .setColor(member?.displayHexColor || "Blurple")
            .addFields({ name: "Tag", value: target.tag, inline: true }, { name: "ID", value: target.id, inline: true }, { name: "Bot", value: target.bot ? "Yes" : "No", inline: true }, {
            name: "Joined Server",
            value: member?.joinedAt?.toLocaleDateString() || "N/A",
            inline: true,
        }, { name: "Account Created", value: target.createdAt.toLocaleDateString(), inline: true }, { name: "Roles", value: roles, inline: false })
            .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
    async UserInfoMessage(command) {
        const args = command.argString.trim();
        let target;
        if (args) {
            const mention = command.message.mentions.users.first();
            target = mention || command.message.client.users.cache.get(args) || command.message.author;
        }
        else {
            target = command.message.author;
        }
        const member = command.message.guild?.members.cache.get(target.id);
        const mentionedRole = command.message.mentions.roles.first();
        const roleColor = mentionedRole?.color ?? 0;
        const authorMember = command.message.guild?.members.cache.get(command.message.author.id);
        const baseColor = authorMember?.displayColor && authorMember.displayColor !== 0
            ? authorMember.displayColor
            : 0x5865f2;
        const color = roleColor !== 0 ? roleColor : baseColor;
        const roles = member?.roles.cache
            .filter((r) => r.id !== command.message.guild?.id)
            .map((r) => r.toString())
            .join(", ") || "None";
        const embed = new EmbedBuilder()
            .setTitle(`${target.username}'s Info`)
            .setThumbnail(target.displayAvatarURL({ size: 256 }))
            .setColor(member?.displayHexColor || "Blurple")
            .addFields({ name: "Tag", value: target.tag, inline: true }, { name: "ID", value: target.id, inline: true }, { name: "Bot", value: target.bot ? "Yes" : "No", inline: true }, {
            name: "Joined Server",
            value: member?.joinedAt?.toLocaleDateString() || "N/A",
            inline: true,
        }, { name: "Account Created", value: target.createdAt.toLocaleDateString(), inline: true }, { name: "Roles", value: roles, inline: false })
            .setFooter({
            text: `${command.message.author.tag}`,
            iconURL: command.message.author.displayAvatarURL(),
        })
            .setTimestamp();
        await command.message.reply({ embeds: [embed] });
    }
};
__decorate([
    Slash({ name: "userinfo", description: "Show information about a user" }),
    __param(0, SlashOption({
        name: "user",
        description: "The user you want info about",
        required: false,
        type: ApplicationCommandOptionType.User,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CommandInteraction]),
    __metadata("design:returntype", Promise)
], UserInfoCommand.prototype, "UserInfoSlash", null);
__decorate([
    SimpleCommand({ aliases: ["user"], name: "userinfo" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SimpleCommandMessage]),
    __metadata("design:returntype", Promise)
], UserInfoCommand.prototype, "UserInfoMessage", null);
UserInfoCommand = __decorate([
    Discord(),
    Category("Info Command")
], UserInfoCommand);
export { UserInfoCommand };
