# React Native AutoLink

[![Version][version-image]][package-url] [![Downloads][downloads-image]][package-url] [![Build Status][build-image]][build-url] [![License][license-image]][license-url]

Auto-Linking component for React Native. Parses text and wraps URLs, phone numbers, emails, social handles, hashtags, and more with Text nodes and onPress handlers. And it's all fully customizable :)

## Installation

```javascript
npm install react-native-autolink --save
```

## Usage

Simply import the library and pass desired props:

```javascript
import Autolink from 'react-native-autolink';

class MyComponent extends Component {
  render() {
    return (
      <Autolink
        text="This is the string to parse for urls (https://github.com/joshswan/react-native-autolink), phone numbers (415-555-5555), emails (josh@example.com), mentions/handles (@twitter), and hashtags (#exciting)"
        hashtag="instagram"
        mention="twitter" />
    );
  }
}
```

## Props

**Note: Any props not listed below will be passed through to the main Text node (e.g. style, numberOfLines).**

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `text` | `String` | | ***Required.*** The string to parse for links. |
| `email` | `Boolean` | `true` | Enable email linking (`mailto:{email}`). |
| `hashtag` | `Boolean/String` | `false` | Enable hashtag linking to supplied service. Possible values: `false`, `"facebook"`, `"instagram"`, `"twitter"`. |
| `latlng` | `Boolean` | `false` | *Experimental* Enable latitude, longitude linking to maps. |
| `mention` | `Boolean/String` | `false` | Enable mention/handle linking to supplied service. Possible values: `false`, `"instagram"`, `"soundcloud"`, `"twitter"`. |
| `phone` | `Boolean/String` | `true` | Enable phone linking (`tel:{number}`, `sms:{number}`) for calling/texting. Possible values: `false`, `"text"`|
| `twitter` | `Boolean` | `false` | **DEPRECATED. Use `mention` prop.** Enable Twitter handle linking (`twitter://user?screen_name={handle}`). |
| `url` | `Boolean/Object` | `true` | Enable url linking (`https://{url}`). Possible values: `true`, `false`, `{ schemeMatches: true/false, wwwMatches: true/false, tldMatches: true/false }` |
| `stripPrefix` | `Boolean` | `true` | Enable stripping of protocol from link text (`https://url` -> `url`). |
| `stripTrailingSlash` | `Boolean` | `true` | Enable stripping of trailing slashs from link text (`example.com/page/` -> `example.com/page`). |
| `linkStyle` | `TextStyle` | | Custom styling to apply to Text nodes of links. |
| `onPress` | `function` | | Custom function handler for link press events. Arguments: `url:String`, [`match:Object`][match-url]. |
| `onLongPress` | `function` | | Function handler for long press events. Arguments: `url:String`, [`match:Object`][match-url] |
| `renderLink` | `function` | | Custom render function for rendering link nodes. Arguments: `text:String`, [`match:Object`][match-url], `index:Number`. |
| `showAlert` | `Boolean` | `false` | Displays an alert before leaving the app to help with accidental clicks. Possible values: `true`, `false` |
| `truncate` | `Number` | `32` | Truncate long link text for display (e.g. `https://www.google.com/../something.html`). Possible values: `0` to disable, `1+` to truncate to that maximum length. |
| `truncateChars` | `String` | `..` | Characters to replace truncated url segments with, if enabled. |
| `truncateLocation` | `String` | `"smart"` | Specify location of truncation. Possible values: `"smart"`, `"end"`, `"middle"`. |
| `webFallback` | `Boolean` | Android: `true` iOS: `false` | Link to web versions of Instagram/Twitter for hashtag and mention links when users don't have the respective app installed. *Requires `LSApplicationQueriesSchemes` on iOS. See: https://facebook.github.io/react-native/docs/linking.html* |

## Supported By

<a href="https://www.disruptivelabs.io">
  <img src="https://www.disruptivelabs.io/images/logo.png" alt="Disruptive Labs" width="150" />
</a>

## License

```text
 Copyright (c) 2016-2020 Josh Swan

 Licensed under the The MIT License (MIT) (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

    https://raw.githubusercontent.com/joshswan/react-native-autolink/master/LICENSE

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.

 See the License for the specific language governing permissions and
 limitations under the License.
```

[build-image]: https://img.shields.io/circleci/build/gh/joshswan/react-native-autolink?style=flat-square
[build-url]: https://circleci.com/gh/joshswan/react-native-autolink
[downloads-image]: https://img.shields.io/npm/dm/react-native-autolink?style=flat-square
[license-image]: https://img.shields.io/npm/l/react-native-autolink?color=blue&style=flat-square
[license-url]: https://github.com/joshswan/react-native-autolink/blob/master/LICENSE
[package-url]: https://www.npmjs.com/package/react-native-autolink
[version-image]: https://img.shields.io/npm/v/react-native-autolink?style=flat-square
[match-url]: http://greg-jacobs.com/Autolinker.js/api/index.html#!/api/Autolinker.match.Match
