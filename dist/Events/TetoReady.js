var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Discord, Once } from "discordx";
import chalk from "chalk";
import { ActivityType } from "discord.js";
let TetoReady = class TetoReady {
    async onReady([_], client) {
        await client
            .clearApplicationCommands()
            .then(() => console.log(`${chalk.blue("[Bot Log]")}: Clearing Old Command...`));
        await client.guilds.fetch();
        await client.initApplicationCommands();
        client.user?.setActivity("video syur", {
            type: ActivityType.Watching,
        });
        console.log(`${chalk.greenBright("[Bot Status]")}: ${client.user?.tag} Active!`);
    }
};
__decorate([
    Once({ event: "ready" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], TetoReady.prototype, "onReady", null);
TetoReady = __decorate([
    Discord()
], TetoReady);
export { TetoReady };
