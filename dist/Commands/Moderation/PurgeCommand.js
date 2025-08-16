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
import { Discord, Slash, SlashOption, SlashChoice, SimpleCommand, SimpleCommandMessage, Guard, SimpleCommandOption, SimpleCommandOptionType, } from "discordx";
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, Collection, } from "discord.js";
import { Category, PermissionGuard } from "@discordx/utilities";
/**
 * Bulk delete message
 * @param user purge selected user message
 * @param amount amount to delete
 */
const ermsg = new EmbedBuilder()
    .setColor("Red")
    .setDescription("❌ You don’t have permission to use this command.")
    .setTimestamp();
let PurgeCommand = class PurgeCommand {
    async PurgeSlash(opt, amount, target, interaction) {
        const channel = interaction.channel;
        try {
            const messages = await channel.messages.fetch({ limit: amount });
            let toDelete;
            if (opt === "any") {
                toDelete = messages;
            }
            else {
                if (!target) {
                    const errorEmbed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("❌ You must specify a user when using `option: user`.");
                    await interaction.reply({ embeds: [errorEmbed] });
                    return;
                }
                toDelete = messages.filter((m) => m.author.id === target.id);
            }
            await channel.bulkDelete(toDelete, true);
            const successEmbed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("🧹 Messages Purged")
                .setDescription(`✅ Deleted **${toDelete.size}** messages ${opt === "user" ? `from **${target?.tag}**` : "from this channel"}.`)
                .setFooter({ text: `Requested by ${interaction.user.tag}` })
                .setTimestamp();
            await interaction.reply({ embeds: [successEmbed] });
        }
        catch (err) {
            console.error(err);
            const errorEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("❌ Purge Failed")
                .setDescription("Make sure I have **Manage Messages** permission and the messages are not older than 14 days.");
            await interaction.reply({ embeds: [errorEmbed] });
        }
    }
    // Optional prefix command version
    async PurgeMessage(mentionable, amount, command) {
        const channel = command.message.channel;
        try {
            const fetchLimit = amount ?? 100;
            const messages = await channel.messages.fetch({ limit: fetchLimit });
            let toDelete = new Collection();
            if (!mentionable) {
                toDelete = messages;
            }
            else {
                const filtered = messages.filter((m) => m.author.id === mentionable.id);
                if (!amount) {
                    toDelete = filtered;
                }
                else {
                    toDelete = new Collection(filtered.first(amount).map((m) => [m.id, m]));
                }
            }
            // Filter out messages older than 14 days
            const now = Date.now();
            toDelete = toDelete.filter((m) => now - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000);
            if (!toDelete.size) {
                const emptyEmbed = new EmbedBuilder()
                    .setColor("Yellow")
                    .setDescription("⚠️ No messages could be deleted (maybe too old or none found).");
                await command.message.reply({ embeds: [emptyEmbed] });
                return;
            }
            await channel.bulkDelete(toDelete, true);
            const successEmbed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("🧹 Messages Purged")
                .setDescription(`✅ Deleted **${toDelete.size}** messages ${mentionable ? `from **${mentionable.user.tag}**` : "from this channel"}.`)
                .setFooter({ text: `Requested by ${command.message.author.tag}` })
                .setTimestamp();
            await command.message.reply({ embeds: [successEmbed] });
        }
        catch (err) {
            console.error(err);
            const errorEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("❌ Purge Failed")
                .setDescription("Make sure I have **Manage Messages** permission and the messages are not older than 14 days.");
            await command.message.reply({ embeds: [errorEmbed] });
        }
    }
};
__decorate([
    Slash({
        name: "purge",
        description: "Bulk delete messages",
    }),
    __param(0, SlashChoice({ name: "user", value: "user" })),
    __param(0, SlashChoice({ name: "any", value: "any" })),
    __param(0, SlashOption({
        name: "option",
        description: "Delete all messages or only from a user",
        type: ApplicationCommandOptionType.String,
        required: true,
    })),
    __param(1, SlashOption({
        name: "amount",
        description: "How many messages to scan (max 100)",
        type: ApplicationCommandOptionType.Integer,
        required: true,
    })),
    __param(2, SlashOption({
        name: "target",
        description: "User to purge messages from (required if option = user)",
        type: ApplicationCommandOptionType.User,
        required: false,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Object, CommandInteraction]),
    __metadata("design:returntype", Promise)
], PurgeCommand.prototype, "PurgeSlash", null);
__decorate([
    SimpleCommand({ name: "purge" }),
    __param(0, SimpleCommandOption({
        name: "user",
        type: SimpleCommandOptionType.User,
    })),
    __param(1, SimpleCommandOption({
        name: "amount",
        type: SimpleCommandOptionType.Number,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, SimpleCommandMessage]),
    __metadata("design:returntype", Promise)
], PurgeCommand.prototype, "PurgeMessage", null);
PurgeCommand = __decorate([
    Discord(),
    Category("Moderation Command"),
    Guard(PermissionGuard(["ManageMessages"], {
        embeds: [ermsg],
    }))
], PurgeCommand);
export { PurgeCommand };
