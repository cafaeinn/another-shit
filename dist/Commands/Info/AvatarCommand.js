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
/**
 * Menampilkan User Avatar
 *
 * @param user User yang diinginkan
 * @return user avatar
 *
 */
let AvatarCommand = class AvatarCommand {
    async AvatarSlash(user, interaction) {
        const target = user ?? interaction.user;
        const member = interaction.guild?.members.cache.get(target.id);
        const color = member?.displayColor && member.displayColor !== 0 ? member.displayColor : 0x5865f2;
        const embed = new EmbedBuilder()
            .setTitle(`${target.username}'s Avatar`)
            .setColor(color)
            .setImage(target.displayAvatarURL({ size: 4096, extension: "png", forceStatic: false }))
            .setFooter({ text: `Requested by ${interaction.user.username}` });
        await interaction.reply({ embeds: [embed] });
    }
    async AvatarMessage(command) {
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
        const color = member?.displayColor && member.displayColor !== 0 ? member.displayColor : 0x5865f2;
        const embed = new EmbedBuilder()
            .setTitle(`${target.username}'s Avatar`)
            .setColor(color)
            .setImage(target.displayAvatarURL({ size: 4096, extension: "png", forceStatic: false }))
            .setFooter({ text: `Requested by ${command.message.author.username}` });
        await command.message.reply({ embeds: [embed] });
    }
};
__decorate([
    Slash({ name: "avatar", description: "Show a user's avatar" }),
    __param(0, SlashOption({
        name: "user",
        description: "The user whose avatar you want to see",
        required: false,
        type: ApplicationCommandOptionType.User,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CommandInteraction]),
    __metadata("design:returntype", Promise)
], AvatarCommand.prototype, "AvatarSlash", null);
__decorate([
    SimpleCommand({ aliases: ["ava", "av"], name: "avatar" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SimpleCommandMessage]),
    __metadata("design:returntype", Promise)
], AvatarCommand.prototype, "AvatarMessage", null);
AvatarCommand = __decorate([
    Discord(),
    Category("Info Command")
], AvatarCommand);
export { AvatarCommand };
