# React Native AutoLink

[![Version][version-image]][package-url] [![Downloads][downloads-image]][package-url] [![Build Status][build-image]][build-url] [![License][license-image]][license-url]

Auto-Linking component for React Native. Parses text and wraps URLs, phone numbers, emails, social handles, hashtags, and more with Text nodes and onPress handlers. And it's all fully customizable :)

## Installation

```shell
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
        mention="twitter"
      />
    );
  }
}
```

## Props

- [`component?`](#component)
- [`email?`](#email)
- [`hashtag?`](#hashtag)
- [`latlng?`](#latlng)
- [`linkProps?`](#linkprops)
- [`linkStyle?`](#linkstyle)
- [`mention?`](#mention)
- [`onPress?`](#onpress)
- [`onLongPress?`](#onlongpress)
- [`phone?`](#phone)
- [`renderLink?`](#renderlink)
- [`renderText?`](#rendertext)
- [`showAlert?`](#showalert)
- [`stripPrefix?`](#stripprefix)
- [`stripTrailingSlash?`](#striptrailingslash)
- [`text`](#text)
- [`textProps?`](#textprops)
- [`truncate?`](#truncate)
- [`truncateChars?`](#truncatechars)
- [`truncateLocation?`](#truncatelocation)
- [`url?`](#url)
- [`webFallback?`](#webfallback)

**Note:** All other props (e.g. `numberOfLines`, `style`, etc.) will be passed through to the container component, which is either `Text` (default) or a custom component supplied to the `component` prop.

### `component`

|        Type         | Required | Default | Description |
| ------------------- | -------- | ------- | ----------- |
| React.ComponentType |    No    | `Text`  | Override the component used as the output container. |

```js
<Autolink text={text} component={View} />
```

### `email`

|  Type   | Required | Default | Description |
| ------- | -------- | ------- | ----------- |
| boolean |    No    | `true`  | Whether to link emails (`mailto:{email}`). |

```js
<Autolink text={text} email={false} />
```

### `hashtag`

|       Type        | Required | Default | Description |
| ----------------- | -------- | ------- | ----------- |
| boolean or string |    No    | `false`  | Whether to link hashtags to supplied service. Possible values: `false` (disabled), `"facebook"`, `"instagram"`, `"twitter"`. |

```js
<Autolink text={text} hashtag="facebook" />
```

### `latlng`

|  Type   | Required | Default | Description |
| ------- | -------- | ------- | ----------- |
| boolean |    No    | `false`  | Whether to link latitude, longitude pairs. |

*Warning:* Still experimental.

```js
<Autolink text={text} latlng />
```

### `linkProps`

|   Type    | Required | Default | Description |
| --------- | -------- | ------- | ----------- |
| TextProps |    No    |  `{}`   | Attributes applied to link Text components. |

```js
<Autolink text={text} linkProps={{ suppressHighlighting: true, testID: 'link' }} />
```

### `linkStyle`

|   Type    | Required | Default | Description |
| --------- | -------- | ------- | ----------- |
| TextStyle |    No    |  `{}`   | Styles applied to link Text components. *Note:* Will be overriden if `style` supplied in [`linkProps`](#linkprops). |

```js
<Autolink text={text} linkStyle={{ color: 'blue' }} />
```

### `mention`

|       Type        | Required | Default | Description |
| ----------------- | -------- | ------- | ----------- |
| boolean or string |    No    | `false`  | Whether to link mentions/handles to supplied service. Possible values: `false` (disabled), `"instagram"`, `"soundcloud"`, `"twitter"`. |

```js
<Autolink text={text} mention="instagram" />
```

### `onPress`

|   Type   | Required | Default | Description |
| -------- | -------- | ------- | ----------- |
| function |    No    |         | Override default link press behavior. Signature: `(url: string, match: Match) => void`. |

```js
<Autolink
  text={text}
  onPress={(url, match) => {
    switch (match.getType()) {
      case 'mention':
        Alert.alert('Mention pressed!');
      default:
        Alert.alert('Link pressed!');
    }
  }}
/>
```

### `onLongPress`

|   Type   | Required | Default | Description |
| -------- | -------- | ------- | ----------- |
| function |    No    |  none   | Handle link long press events. Signature: `(url: string, match: Match) => void`. |

```js
<Autolink
  text={text}
  onLongPress={(url, match) => {
    switch (match.getType()) {
      case 'mention':
        Alert.alert('Mention long pressed!');
      default:
        Alert.alert('Link long pressed!');
    }
  }}
/>
```

### `phone`

|       Type        | Required | Default | Description |
| ----------------- | -------- | ------- | ----------- |
| boolean or string |    No    | `true`  | Whether to link phone numbers. Possible values: `false` (disabled), `true` (`tel:{number}`), `"sms"` or `"text"` (`sms:{number}`). |

*Note:* Currently, only US numbers are supported.

```js
<Autolink text={text} phone="sms" />
```

### `renderLink`

|   Type   | Required | Default | Description |
| -------- | -------- | ------- | ----------- |
| function |    No    |         | Override default link rendering behavior. Signature: `(text: string, match: Match, index: number) => React.ReactNode`. |

*Note:* You'll need to handle press logic yourself when using `renderLink`.

```js
<Autolink
  text={text}
  component={View}
  renderLink={(text, match) => <MyLinkPreviewComponent url={match.getAnchorHref()} />}
/>
```

### `renderText`

|   Type   | Required | Default | Description |
| -------- | -------- | ------- | ----------- |
| function |    No    |         | Override default text rendering behavior. Signature: `(text: string, index: number) => React.ReactNode`. |

```js
<Autolink
  text={text}
  component={View}
  renderText={(text) => <MyTypographyComponent>{text}</MyTypographyComponent>}
/>
```

### `showAlert`

|  Type   | Required | Default | Description |
| ------- | -------- | ------- | ----------- |
| boolean |    No    | `false`  | Whether to display an alert before leaving the app (for privacy or accidental clicks). |

```js
<Autolink text={text} showAlert />
```

### `stripPrefix`

|  Type   | Required | Default | Description |
| ------- | -------- | ------- | ----------- |
| boolean |    No    | `true`  | Whether to strip protocol from URL link text (e.g. `https://github.com` -> `github.com`). |

```js
<Autolink text={text} stripPrefix={false} />
```

### `stripTrailingSlash`

|  Type   | Required | Default | Description |
| ------- | -------- | ------- | ----------- |
| boolean |    No    | `true`  | Whether to strip trailing slashes from URL link text (e.g. `github.com/` -> `github.com`). |

```js
<Autolink text={text} stripTrailingSlash={false} />
```

### `text`

|  Type   | Required | Default | Description |
| ------- | -------- | ------- | ----------- |
| string  |   Yes    |         | The string to parse for links. |

```js
<Autolink text={text} />
```

### `textProps`

|   Type    | Required | Default | Description |
| --------- | -------- | ------- | ----------- |
| TextProps |    No    |  `{}`   | Attributes applied to non-link Text components. |

```js
<Autolink text={text} textProps={{ selectable: false }} />
```

### `truncate`

|   Type    | Required | Default | Description |
| --------- | -------- | ------- | ----------- |
|  number   |    No    |  `32`   | Maximum length of URL link text. Possible values: `0` (disabled), `1+` (maximum length). |

```js
<Autolink text={text} truncate={20} />
```

### `truncateChars`

|   Type    | Required | Default | Description |
| --------- | -------- | ------- | ----------- |
|  string   |    No    |  `..`   | Characters to replace truncated URL link text segments with (e.g. `github.com/../repo`) |

```js
<Autolink text={text} truncateChars="**" />
```

### `truncateLocation`

|   Type    | Required |  Default   | Description |
| --------- | -------- | ---------- | ----------- |
|  string   |    No    | `"smart"`  | Override truncation location. Possible values: `"smart"`, `"end"`, `"middle"`. |

```js
<Autolink text={text} truncateLocation="end" />
```

### `url`

|       Type        | Required | Default | Description |
| ----------------- | -------- | ------- | ----------- |
| boolean or object |    No    | `true`  | Whether to link URLs. Possible values: `false` (disabled), `true`, `UrlConfig` (see below). |

```js
type UrlConfig = {
  // Whether to link URLs prefixed with a scheme (e.g. https://github.com)
  schemeMatches?: boolean;
  // Whether to link URLs prefix with www (e.g. www.github.com)
  wwwMatches?: boolean;
  // Whether to link URLs with TLDs but not scheme or www prefixs (e.g. github.com)
  tldMatches?: boolean;
};
```

```js
<Autolink text={text} url={false} />
<Autolink text={text} url={{ tldMatches: false }} />
```

### `webFallback`

|  Type   | Required |            Default            | Description |
| ------- | -------- | ----------------------------- | ----------- |
| boolean |    No    | Android: `true`, iOS: `false` | Whether to link to web versions of services (e.g. Facebook, Instagram, Twitter) for hashtag and mention links when users don't have the respective app installed. |

*Note:* Requires `LSApplicationQueriesSchemes` on iOS so it is disabled by default on iOS. See [Linking docs](https://reactnative.dev/docs/linking.html) for more info.

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
