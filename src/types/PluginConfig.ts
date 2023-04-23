export default interface PluginConfig {
    pubspecPath?: string;
    majorWeight?: number;
    minorWeight?: number;
    patchWeight?: number;
    channelWeight?: number;
    preReleaseWeight?: number;
}
