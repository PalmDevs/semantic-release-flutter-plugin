import { parse as parseVersion } from 'semver';
import PluginConfig from '../types/PluginConfig';
import { BranchSpec } from 'semantic-release';

function calculateVersionCode(
    options: CalculateVersionCodeOptions,
    branches: BranchSpec | readonly BranchSpec[]
) {
    const {
        versionString,
        majorWeight,
        minorWeight,
        patchWeight,
        channelWeight,
        preReleaseWeight,
    } = options;

    const versionObject = parseVersion(versionString);
    if (!versionObject) throw new Error('Cannot parse version string');

    const {
        major,
        minor,
        patch,
        prerelease: [channel, build],
    } = versionObject;
    const isPreRelease = !!channel && !!build;

    const channelIndex = Array.isArray(branches)
        ? branches.findIndex(
              branch =>
                  branch === channel ||
                  (typeof branch === 'object' &&
                      (branch.channel || branch.name) === channel)
          )
        : 0;

    if (channelIndex < 0 && isPreRelease)
        throw new Error(
            `The release channel (${channel}) is not in the list of branches`
        );

    const [minorLimit, patchLimit, channelLimit, preReleaseLimit] = [
        majorWeight / minorWeight,
        minorWeight / patchWeight,
        channelWeight ? patchWeight / channelWeight : 1,
        (channelWeight || patchWeight) / preReleaseWeight,
    ];

    if (minor >= minorLimit)
        throw new Error(
            `The minor version (${minor}) is too large, the limit of it is ${
                minorLimit - 1
            } per a major version`
        );
    if (patch >= patchLimit)
        throw new Error(
            `The patch version (${patch}) is too large, the limit of it is ${
                patchLimit - 1
            } per a minor version`
        );
    if (channelIndex >= channelLimit)
        throw new Error(
            `There are too many release channels, the limit of it is ${channelLimit} release channels`
        );

    if (
        (channel && build && Number(build) > preReleaseLimit) ||
        Number(build) < 0
    )
        throw new Error(
            `The pre-release build number (${build}) is too large, the limit of it is ${preReleaseLimit} prereleases per a version`
        );

    let versionCode = 0;
    versionCode += major * majorWeight;
    versionCode += minor * minorWeight;
    versionCode += patch * patchWeight;
    versionCode += isPreRelease ? channelIndex * channelWeight : 0;
    if (channel && build)
        versionCode += Math.max(Number(build) - 1, 0) * preReleaseWeight;

    return versionCode;
}

export type CalculateVersionCodeOptions = Required<
    Omit<PluginConfig & { versionString: string }, 'pubspecPath'>
>;

export default calculateVersionCode;
