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

    logger.log('Verifying options: %s', pluginConfig);

    const weightErrors: Error[] = [];

    (Object.keys(pluginConfig) as (keyof typeof pluginConfig)[]).forEach(
        key => {
            if (
                key.endsWith('Weight') &&
                !(
                    typeof pluginConfig === 'undefined' ||
                    (typeof pluginConfig[key] === 'number' &&
                        // @ts-expect-error Shut up
                        pluginConfig[key] >= 0)
                )
            )
                weightErrors.push(
                    new Error(
                        `Option ${key} (${pluginConfig[key]}) must be a number higher than 0`
                    )
                );
        }
    );

    if (pluginConfig.minorWeight! >= pluginConfig.majorWeight!)
        weightErrors.push(
            new Error(
                `Option minorWeight must be lower than majorWeight (${pluginConfig.majorWeight})`
            )
        );
    if (pluginConfig.patchWeight! >= pluginConfig.minorWeight!)
        weightErrors.push(
            new Error(
                `Option patchWeight must be lower than minorWeight (${pluginConfig.minorWeight})`
            )
        );
    if (pluginConfig.channelWeight! >= pluginConfig.patchWeight!)
        weightErrors.push(
            new Error(
                `Option channelWeight must be lower than patchWeight (${pluginConfig.patchWeight})`
            )
        );
    if (
        pluginConfig.preReleaseWeight! >=
        (pluginConfig.channelWeight || pluginConfig.patchWeight)!
    )
        weightErrors.push(
            new Error(
                `Option preReleaseWeight must be lower than ${
                    pluginConfig.channelWeight
                        ? `channelWeight (${pluginConfig.channelWeight})`
                        : `patchWeight (${pluginConfig.patchWeight})`
                }}`
            )
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
