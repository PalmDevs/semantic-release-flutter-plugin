import fs from 'fs';
import path from 'path';
import type { Config, Context } from 'semantic-release';
import type PluginConfig from '../types/PluginConfig.js';

export default function verifyConditions(
    pluginConfig: PluginConfig | null | undefined,
    context: Config & Context
) {
    const { logger } = context;
    if (!pluginConfig) throw new AggregateError(['No options passed']);

    const weightErrors: Error[] = [];

    (Object.keys(pluginConfig) as (keyof typeof pluginConfig)[]).forEach(
        key => {
            if (
                key.endsWith('Weight') &&
                !['undefined', 'number'].includes(typeof pluginConfig[key])
            )
                weightErrors.push(new Error(`Option ${key} must be a number`));
        }
    );

    if (weightErrors.length > 0) throw new AggregateError(weightErrors);

    pluginConfig.pubspecPath = path.join(
        context.cwd ?? process.cwd(),
        pluginConfig.pubspecPath ?? 'pubspec.yaml'
    );

    logger.log('Checking if pubspec file exists: %s', pluginConfig.pubspecPath);

    if (!fs.existsSync(pluginConfig.pubspecPath))
        throw new AggregateError([
            `Cannot find pubspec file: ${pluginConfig.pubspecPath}`,
        ]);
}
