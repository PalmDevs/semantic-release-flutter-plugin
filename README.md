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
[The highest version code Play Store allows is `2100000000` (2 billion, 100 million)](https://developer.android.com/studio/publish/versioning#versioningsettings). Which means you'll need to configure the values carefully. If you don't want to publish your app to Play Store, the limit can be ignored.  

The default configuration allows for:
- 21 major versions
- 1000 minor versions (in a single major version)
- 100 patch versions (in a single minor version)
- 10 release channels
- 100 prerelease builds (in a single version)

The limits are calculated by doing `upperWeight / currentWeight`, eg. if you want to calculate a minor version limit, you can do `majorWeight / minorWeight`.

### Examples
> **Warning**: The order in the `branches` property matters! The plugin will generate a higher version code depending on where you place your branch configuration on the array.  
> 
> When the plugin notices a prerelease version (eg. `v1.1.0-alpha.1`), it will get the index of where the prerelease branch configuration is (in this case, `alpha`). In the below example, the index that it gets is `2`, then it multiplies that number by the supplied `preReleaseExponent * versionCodeBase` and adds it to the version code number.  
>
> This would mean that users from the `alpha` channel wouldn't be able to downgrade to `beta` *(index `1`)* or the `main` *(index `0`)* channel, as the index for those configuration is lower than the `alpha`'s index.  
> 
> If you want to disable this feature, set `channelWeight` to `0`. This will increase room for more version codes.

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
