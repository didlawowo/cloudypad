import * as fs from 'fs'
import { InlineProgramArgs, LocalWorkspace, LocalWorkspaceOptions, OutputMap, PulumiFn, Stack } from "@pulumi/pulumi/automation";
import { getLogger, Logger } from '../../log/utils';
import { StateManager } from '../../core/state/manager';

export interface InstancePulumiClientArgs {
    program: PulumiFn
    projectName: string
    stackName: string
}

/**
 * An abstract Pulumi client for a Cloudy Pad instance
 */
export abstract class InstancePulumiClient<ConfigType, OutputType> {

    readonly program: PulumiFn
    readonly projectName: string
    readonly stackName: string
    protected readonly logger: Logger
    private stack: Stack | undefined
    private stateManager: StateManager

    constructor(args: InstancePulumiClientArgs){
        this.program = args.program
        this.projectName = args.projectName
        this.stackName = args.stackName
        this.logger = getLogger(`${args.projectName}-${args.stackName}`)
        this.stateManager = StateManager.default()
    }

    protected async getStack(): Promise<Stack>{
        if(this.stack === undefined) {
            this.stack = await this.initStack()
        }
        return this.stack
    }

    public async setConfig(config: ConfigType): Promise<void> {
        // wrap call around this side-effect call to easily stub during test
        await this.doSetConfig(config)
    }

    protected abstract doSetConfig(config: ConfigType): Promise<void>

    protected abstract buildTypedOutput(outputs: OutputMap): Promise<OutputType>

    private async initStack(){
        this.logger.debug(`Initializing stack and config`)

        // Force use of local backend unless environment configured otherwise
        // Pulumi state is a state so Pulumi state path depends on StateManager path
        const backendUrl = process.env.PULUMI_BACKEND_URL ?? `file://${this.stateManager.getDataRootDir()}/pulumi-backend`
        const configPassphrase=`${process.env.PULUMI_CONFIG_PASSPHRASE ?? ""}`
        
        if(this.stack !== undefined) {
            throw new Error(`Stack ${this.stackName} for project ${this.projectName} has already been initialized. This is probably an internal bug.`)
        }

        const opts: LocalWorkspaceOptions = {
            envVars: {
                PULUMI_BACKEND_URL: backendUrl,
                PULUMI_CONFIG_PASSPHRASE: configPassphrase
            }
        }

        // Ensure Pulumi directories exists
        // TODO unit test 
        if(backendUrl.startsWith("file://")){
            const pulumiBackendDir = backendUrl.slice("file://".length)
            if (!fs.existsSync(pulumiBackendDir)){
                
                this.logger.debug(`Creating File PULUMI_BACKEND_URL ${pulumiBackendDir}`)
                
                fs.mkdirSync(pulumiBackendDir, { recursive: true });
            }
        }

        const pulumiArgs: InlineProgramArgs = {
            stackName: this.stackName,
            projectName: this.projectName,
            program: this.program,
        }

        const stack = await LocalWorkspace.createOrSelectStack(pulumiArgs, opts)
        return stack
    }

    async up(){

        const stack = await this.getStack()

        this.logger.debug(`Running Pulumi up: ${stack.name}`)
        this.logger.debug(`Config before up: ${JSON.stringify(await stack.getAllConfig())}`)

        // Always cancel in case command was interrupted before
        // Considering use case it's unlikely a parallel update might occur
        // But it's likely that user will interrupt leaving stack with a lock which would stuck otherwise
        // Might become a flag later
        await stack.cancel()

        const upRes = await stack.up({ onOutput: (msg) => { console.info(msg.trim()) }, color: "auto", refresh: true })
        
        this.logger.trace(`Up result: ${JSON.stringify(upRes)}`)
        
        const outputs = await stack.outputs()

        this.logger.debug(`Up outputs: ${JSON.stringify(outputs)}`)

        return this.buildTypedOutput(outputs)
    }

    async preview(){
        const stack = await this.getStack()

        this.logger.debug(`Running Pulumi preview: ${stack.name}`)
        this.logger.debug(`Config before up: ${JSON.stringify(await stack.getAllConfig())}`)

        // Always cancel in case command was interrupted before
        // Considering use case it's unlikely a parallel update might occur
        // But it's likely that user will interrupt leaving stack with a lock which would stuck otherwise
        // Might become a flag later
        await stack.cancel()

        const prevRes = await stack.preview({ onOutput: (msg) => { console.info(msg.trim()) }, color: "auto", refresh: true })
        
        this.logger.trace(`Preview result: ${JSON.stringify(prevRes)}`)

        return prevRes
    }

    async destroy(){
        this.logger.debug(`Destroying stack`)
        const stack = await this.getStack()

        // Always cancel in case command was interrupted before
        // Considering use case it's unlikely a parallel update might occur
        // But it's likely that user will interrupt leaving stack with a lock which would stuck otherwise
        // Might become a flag later
        await stack.cancel()
        
        this.logger.debug(`Refreshing stack ${stack.name} before destroy result`)

        const refreshRes = await stack.refresh({ onOutput: console.info, color: "auto" })
        this.logger.trace(`Refresh result: ${JSON.stringify(refreshRes)}`)

        const destroyRes = await stack.destroy({ onOutput: console.info, color: "auto", remove: true })
        this.logger.trace(`Destroy result: ${JSON.stringify(destroyRes)}`)
   }
}