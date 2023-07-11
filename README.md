# semantic-release-flutter-plugin

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin to bump pubspec.yaml version with version code support.
> **Warning**: Your `branches` array configuration order for **semantic-release** actually matters. More explanation [here](#examples).

| Step               | Description                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `verifyConditions` | Verify if the file `pubspecPath` in configuration exists.                                             |
| `prepare`          | Verify if the contents of file pubspec.yaml file is valid and updates the file's version field.       |

## Install

```bash
$ npm install semantic-release-flutter-plugin -D
```

### Options

| Options                  | Description                                                                   | Default                                                                             |
| ------------------------ | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `pubspecPath`            | The path of the **pubspec.yaml** file | `${CWD}/pubspec.yaml`<br/><br/>Where `CWD` is `context.cwd` given by **semantic-release** or if undefined, `process.cwd()`. |                                                                                                                     |
| `majorWeight`            | The weight of a major version         | `100000000` (100 million)                                                                                                   |
| `minorWeight`            | The weight of a minor version         | `100000` (100 thousand)                                                                                                     |
| `patchWeight`            | The weight of a patch version         | `1000`                                                                                                                      |
| `channelWeight`          | The weight of a release channel       | `100`                                                                                                                       |
| `preReleaseWeight`       | The weight of a prerelease number     | `1`                                                                                                                         |

#### Deciding weights
[The highest version code Play Store allows is `2100000000` (2 billion, 100 million)](https://developer.android.com/studio/publish/versioning#versioningsettings). Which means you'll need to configure the weights carefully. This is also very close to the 32-bit integer limit.

If you don't want to publish your app to Play Store or support 32-bit devices, the limit can be safely ignored.  

The default configuration allows for:
- 21 major versions
- 1000 minor versions (in a single major version)
- 100 patch versions (in a single minor version)
- 10 release channels
- 100 prerelease builds (in a single version)

> The limits are calculated by doing `upperNonZeroWeight / currentWeight`, eg. if you want to calculate a minor version limit, you can do `majorWeight / minorWeight`.
>
> If `upperNonZeroWeight` is `0`, look for the upper weight of the `upperWeight`, eg. if you set `channelWeight` to `0`, the formula for prerelease number limit is `patchWeight / preReleaseWeight` *(because `patchWeight` is `channelWeight`'s upper limit)*.

### How version codes are calculated
The weight properties in the configuration is responsible for all the computing. The plugin gets each version number and multiplies it by the weight given in configuration. **There are exceptions**, such as the prerelease build number which gets `1` removed from the number before multiplying (because the first prerelease number always is `1` and not `0`). Here are examples for the default configuration.

**v1.2.3**
- `1 * 100000000` (major)
- `2 * 100000` (minor)
- `3 * 1000` (patch)
- `100000000 + 200000 + 3000 = 100203000` (sum)

**v1.2.4-alpha.2** ([with branches configuration below](#examples))
- `1 * 100000000`
- `2 * 100000`
- `4 * 1000`
- `2 * 100` (channel)
- `(2 - 1) * 1` (prerelease)

### Examples
> **Warning**: The order in the `branches` property matters! The plugin will generate a higher version code depending on where you place your branch configuration in the `branches` array.  
> 
> When the plugin notices a prerelease version (eg. `v1.1.0-alpha.1`), it will get the index of where the prerelease branch configuration is (in this case, `alpha`, index `2`), then it multiplies that number by the supplied the `channelWeight` option (`2 * channelWeight`) and adds it to the version code number.  
>
> This would mean that users from the `alpha` release channel wouldn't be able to downgrade to `beta` *(index `1`)* or the `main` *(index `0`)* channel, as the index for those is lower than the `alpha` release channel's index.  
> 
> If you want to disable this feature, set `channelWeight` to `0`. This will also increase room for more version codes.

You must have 2 configuration files. One for bumping which will be run before building and one for making releases and uploading assets. You'll also need to run semantic-release twice.

`bump.releaserc` (before building)
```json
{
  "branches": [
    "main",
    {
      "name": "beta",
      "prerelease": true
    },
    {
      "name": "alpha",
      "prerelease": true
    }
  ],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "semantic-release-flutter-plugin",
      {
        "pubspecPath": "pubspec.yaml"
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": [
          "pubspec.yaml"
        ]
      }
    ]
  ]
}
```
