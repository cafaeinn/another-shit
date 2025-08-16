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
import { CommandInteraction, EmbedBuilder, ChannelType } from "discord.js";
import { Vibrant } from "node-vibrant/node";
import fetch from "node-fetch";
let ServerInfoCommand = class ServerInfoCommand {
    async ServerInfoSlash(interaction) {
        if (!interaction.guild) {
            return interaction.reply({
                content: "This command can only be used in a server.",
                ephemeral: true,
            });
        }
        const guild = interaction.guild;
        await guild.fetch();
        let color = 0x5865f2;
        const iconUrl = guild.iconURL({ extension: "png", size: 512 });
        if (iconUrl) {
            try {
                const buffer = Buffer.from(await (await fetch(iconUrl)).arrayBuffer());
                const palette = await Vibrant.from(buffer).getPalette();
                if (palette?.Vibrant) {
                    const [r, g, b] = palette.Vibrant.rgb;
                    color = (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b);
                }
            }
            catch {
                // ignore errors
            }
        }
        // ===== Roles (truncate after 7) =====
        const roles = guild.roles.cache
            .filter((r) => r.id !== guild.id)
            .sort((a, b) => b.position - a.position)
            .map((r) => r.toString());
        let rolesValue = "None";
        if (roles.length > 0) {
            if (roles.length > 7) {
                const shown = roles.slice(0, 7).join(", ");
                rolesValue = `${shown} ...and ${roles.length - 7} more`;
            }
            else {
                rolesValue = roles.join(", ");
            }
        }
        // ===== Channels (truncate after 7) =====
        const channels = guild.channels.cache
            .filter((c) => c.type !== ChannelType.GuildCategory && // skip categories
            !c.isThread() // skip thread channels
        )
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) // use position instead of rawPosition
            .map((c) => `#${c.name}`);
        let channelsValue = "None";
        if (channels.length > 0) {
            if (channels.length > 7) {
                const shown = channels.slice(0, 7).join(", ");
                channelsValue = `${shown} ...and ${channels.length - 7} more`;
            }
            else {
                channelsValue = channels.join(", ");
            }
        }
        const embed = new EmbedBuilder()
            .setTitle(`${guild.name} Info`)
            .setThumbnail(iconUrl)
            .setColor(color)
            .addFields({ name: "Name", value: guild.name, inline: true }, { name: "ID", value: guild.id, inline: true }, { name: "Owner", value: `<@${guild.ownerId}>`, inline: true }, {
            name: "Created",
            value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`,
            inline: true,
        }, { name: "Members", value: `${guild.memberCount}`, inline: true }, { name: "Roles Count", value: `${guild.roles.cache.size}`, inline: true }, { name: "Channels Count", value: `${guild.channels.cache.size}`, inline: true }, { name: "Role List", value: rolesValue }, { name: "Channel List", value: channelsValue })
            .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    }
    async ServerInfoMessage(command) {
        const guild = command.message.guild;
        if (!guild) {
            return command.message.reply("This command can only be used in a server.");
        }
        await guild.fetch();
        let color = 0x5865f2;
        const iconUrl = guild.iconURL({ extension: "png", size: 512 });
        if (iconUrl) {
            try {
                const buffer = Buffer.from(await (await fetch(iconUrl)).arrayBuffer());
                const palette = await Vibrant.from(buffer).getPalette();
                if (palette?.Vibrant) {
                    const [r, g, b] = palette.Vibrant.rgb;
                    color = (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b);
                }
            }
            catch {
                // ignore errors
            }
        }
        // ===== Roles (truncate after 7) =====
        const roles = guild.roles.cache
            .filter((r) => r.id !== guild.id)
            .sort((a, b) => b.position - a.position)
            .map((r) => r.toString());
        let rolesValue = "None";
        if (roles.length > 0) {
            if (roles.length > 7) {
                const shown = roles.slice(0, 7).join(", ");
                rolesValue = `${shown} ...and ${roles.length - 7} more`;
            }
            else {
                rolesValue = roles.join(", ");
            }
        }
        // ===== Channels (truncate after 7) =====
        const channels = guild.channels.cache
            .filter((c) => c.type !== ChannelType.GuildCategory && // skip categories
            !c.isThread() // skip thread channels
        )
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) // use position instead of rawPosition
            .map((c) => `#${c.name}`);
        let channelsValue = "None";
        if (channels.length > 0) {
            if (channels.length > 7) {
                const shown = channels.slice(0, 7).join(", ");
                channelsValue = `${shown} ...and ${channels.length - 7} more`;
            }
            else {
                channelsValue = channels.join(", ");
            }
        }
        const embed = new EmbedBuilder()
            .setTitle(`${guild.name} Info`)
            .setThumbnail(iconUrl)
            .setColor(color)
            .addFields({ name: "Name", value: guild.name, inline: true }, { name: "ID", value: guild.id, inline: true }, { name: "Owner", value: `<@${guild.ownerId}>`, inline: true }, {
            name: "Created",
            value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`,
            inline: true,
        }, { name: "Members", value: `${guild.memberCount}`, inline: true }, { name: "Roles Count", value: `${guild.roles.cache.size}`, inline: true }, { name: "Channels Count", value: `${guild.channels.cache.size}`, inline: true }, { name: "Role List", value: rolesValue }, { name: "Channel List", value: channelsValue })
            .setFooter({
            text: `${command.message.author.tag}`,
            iconURL: command.message.author.displayAvatarURL(),
        })
            .setTimestamp();
        await command.message.reply({ embeds: [embed] });
    }
};
__decorate([
    Slash({ name: "serverinfo", description: "Show information about the server" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction]),
    __metadata("design:returntype", Promise)
], ServerInfoCommand.prototype, "ServerInfoSlash", null);
__decorate([
    SimpleCommand({ aliases: ["server"], name: "serverinfo" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SimpleCommandMessage]),
    __metadata("design:returntype", Promise)
], ServerInfoCommand.prototype, "ServerInfoMessage", null);
ServerInfoCommand = __decorate([
    Discord(),
    Category("Info Command")
], ServerInfoCommand);
export { ServerInfoCommand };
