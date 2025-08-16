var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Discord, Slash, SimpleCommand, SimpleCommandMessage } from "discordx";
import { Category } from "@discordx/utilities";
import { CommandInteraction, EmbedBuilder } from "discord.js";
let PingCommand = class PingCommand {
    async PingSlash(interaction) {
        const sent = await interaction.reply({ content: "Pinging...", fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const apiLatency = Math.round(interaction.client.ws.ping);
        const member = interaction.guild?.members.cache.get(interaction.user.id);
        const color = member?.displayColor && member.displayColor !== 0 ? member.displayColor : 0x5865f2;
        const embed = new EmbedBuilder()
            .setTitle("🏓 Pong!")
            .setColor(color)
            .addFields({ name: "Bot Latency", value: `${latency}ms`, inline: true }, { name: "API Latency", value: `${apiLatency}ms`, inline: true })
            .setTimestamp();
        await interaction.editReply({ content: "", embeds: [embed] });
    }
    async PingMessage(command) {
        const sent = await command.message.reply("Pinging...");
        const latency = sent.createdTimestamp - command.message.createdTimestamp;
        const apiLatency = Math.round(command.message.client.ws.ping);
        const member = command.message.guild?.members.cache.get(command.message.author.id);
        const color = member?.displayColor && member.displayColor !== 0 ? member.displayColor : 0x5865f2;
        const embed = new EmbedBuilder()
            .setTitle("🏓 Pong!")
            .setColor(color)
            .addFields({ name: "Bot Latency", value: `${latency}ms`, inline: true }, { name: "API Latency", value: `${apiLatency}ms`, inline: true })
            .setTimestamp();
        await sent.edit({ content: "", embeds: [embed] });
    }
};
__decorate([
    Slash({ name: "ping", description: "Check bot latency" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction]),
    __metadata("design:returntype", Promise)
], PingCommand.prototype, "PingSlash", null);
__decorate([
    SimpleCommand({ name: "ping" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SimpleCommandMessage]),
    __metadata("design:returntype", Promise)
], PingCommand.prototype, "PingMessage", null);
PingCommand = __decorate([
    Discord(),
    Category("Info Command")
], PingCommand);
export { PingCommand };
