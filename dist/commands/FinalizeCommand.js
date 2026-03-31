"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinalizeCommand = void 0;
const path = require("path");
const services_1 = require("../services");
const BaseCommand_1 = require("./BaseCommand");
const VerifyCommand_1 = require("./VerifyCommand");
const ArchiveCommand_1 = require("./ArchiveCommand");
class FinalizeCommand extends BaseCommand_1.BaseCommand {
    async execute(featurePath) {
        try {
            const targetPath = featurePath || process.cwd();
            const projectRoot = path.resolve(targetPath, '..', '..', '..');
            this.info(`Finalizing change at ${targetPath}`);
            const verifyCmd = new VerifyCommand_1.VerifyCommand();
            await verifyCmd.execute(targetPath);
            await services_1.services.projectService.rebuildIndex(projectRoot);
            const archiveCmd = new ArchiveCommand_1.ArchiveCommand();
            const archivePath = await archiveCmd.execute(targetPath, { checkOnly: false });
            this.success(`Change finalized: ${archivePath}`);
        }
        catch (error) {
            this.error(`Finalize failed: ${error}`);
            throw error;
        }
    }
}
exports.FinalizeCommand = FinalizeCommand;
