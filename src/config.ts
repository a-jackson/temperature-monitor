import * as fs from 'fs';
import * as path from 'path';
import { Configuration } from './models/configuration';
import defaultConfig from './models/default-configuration';

export class Config {
    private readonly configFilePath: string;
    private loadedConfig: Configuration;

    constructor() {
        this.configFilePath = path.join(
            process.env.HOME,
            '.temperature-monitor.config',
        );
    }

    public async loadConfig() {
        let config: Partial<Configuration> = {};
        try {
            if (await this.configFileExists()) {
                const configString = await this.readConfigFile();
                config = JSON.parse(configString);
            }
        } catch (err) { 
            console.log("Failed to load config file: " + err);
            process.exit(1);
        }

        this.loadedConfig = Object.assign(
            config,
            defaultConfig,
        ) as Configuration;
    }

    public get config() {
        return this.loadedConfig;
    }

    private configFileExists() {
        return new Promise<boolean>((resolve, _) =>
            fs.exists(this.configFilePath, resolve),
        );
    }

    private readConfigFile() {
        return new Promise<string>((resolve, reject) =>
            fs.readFile(this.configFilePath, 'utf8', (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            }),
        );
    }
}
