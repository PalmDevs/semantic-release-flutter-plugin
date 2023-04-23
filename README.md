# semantic-release-flutter-plugin

[**semantic-release**](https://github.com/semantic-release/semantic-release) plugin to bump pubspec.yaml version with version code support.

| Step               | Description                                                                                           |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `verifyConditions` | Verify if the file `pubspecPath` in configuration exists.                                             |
| `prepare`          | Verify if the contents of file pubspec.yaml file is valid and updates the file's version field.       |

## Install

```bash
$ npm install semantic-release-flutter-plugin -D
```

### Options

| Options              | Description                                                                   | Default                                                                                                                     |
| -------------------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `pubspecPath`        | The path to the **pubspec.yaml** file to append the generated version code to | `${CWD}/pubspec.yaml`<br/><br/>Where `CWD` is `context.cwd` given by **semantic-release** or if undefined, `process.cwd()`. |
| `versionCodeBase`    | The base number to be used for calculating version code                       | `1`                                                                                                                         |
| `majorExponent`      | The exponent number to use for calculating the major version code             | `100000000`                                                                                                                 |
| `minorExponent`      | The exponent number to use for calculating the minor version code             | `100000`                                                                                                                    |
| `patchExponent`      | The exponent number to use for calculating the patch version code             | `100`                                                                                                                       |
| `preReleaseExponent` | The exponent number to use for calculating the prerelease number version code | `1`                                                                                                                         |

#### Deciding Exponents
...

### Examples

```json
{
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
