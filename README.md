# React Native AutoLink

[![Version][version-image]][package-url] [![Downloads][downloads-image]][package-url] [![Build Status][build-image]][build-url] [![License][license-image]][license-url]

Auto-Linking component for React Native. Parses text and wraps URLs, phone numbers, emails, social handles, hashtags, and more with Text nodes and onPress handlers.

**New in v4**: Autolink any pattern using [custom regex matchers](#custom-matchers) and click handlers! Thanks @lafiosca!

## Installation

```shell
npm i react-native-autolink
```

## Usage

Simply import the library and enable the link types you want to auto-link:

```javascript
import Autolink from 'react-native-autolink';

const MyComponent = () => (
  <Autolink
    // Required: the text to parse for links
    text="This is the string to parse for urls (https://github.com/joshswan/react-native-autolink), phone numbers (415-555-5555), emails (josh@example.com), mentions/handles (@twitter), and hashtags (#exciting)"
    // Optional: enable email linking
    email
    // Optional: enable hashtag linking to instagram
    hashtag="instagram"
    // Optional: enable @username linking to twitter
    mention="twitter"
    // Optional: enable phone linking
    phone="sms"
    // Optional: enable URL linking
    url
    // Optional: custom linking matchers
    matchers={[MyCustomTextMatcher]}
  />
);
```

_Note_: No link types are enabled by default as of v4. Be sure to enable one or more (e.g. `email`, `hashtag`, `phone`, etc.) or you won't see anything linked!

## Props

- [`component?`](#component)
- [`email?`](#email)
- [`hashtag?`](#hashtag)
- [`linkProps?`](#linkprops)
- [`linkStyle?`](#linkstyle)
- [`matchers?`](#matchers)
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
- [`useNativeSchemes?`](#usenativeschemes)

**Note:** All other props (e.g. `numberOfLines`, `style`, etc.) will be passed through to the container component, which is either `Text` (default) or a custom component supplied to the `component` prop.

### `component`

| Type                | Required | Default | Description                                          |
| ------------------- | -------- | ------- | ---------------------------------------------------- |
| React.ComponentType | No       | `Text`  | Override the component used as the output container. |

```js
<Autolink text={text} component={View} />
```

### `email`

| Type    | Required | Default | Description                                |
| ------- | -------- | ------- | ------------------------------------------ |
| boolean | No       | `true`  | Whether to link emails (`mailto:{email}`). |

```js
<Autolink text={text} email={false} />
```

### `hashtag`

| Type              | Required | Default | Description                                                                                                                  |
| ----------------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------------------- |
| boolean or string | No       | `false` | Whether to link hashtags to supplied service. Possible values: `false` (disabled), `"facebook"`, `"instagram"`, `"twitter"`. |

```js
<Autolink text={text} hashtag="facebook" />
```

### `linkProps`

| Type      | Required | Default | Description                                 |
| --------- | -------- | ------- | ------------------------------------------- |
| TextProps | No       | `{}`    | Attributes applied to link Text components. |

```js
<Autolink text={text} linkProps={{ suppressHighlighting: true, testID: 'link' }} />
```

### `linkStyle`

| Type      | Required | Default | Description                                                                                                         |
| --------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------- |
| TextStyle | No       | `{}`    | Styles applied to link Text components. _Note:_ Will be overriden if `style` supplied in [`linkProps`](#linkprops). |

```js
<Autolink text={text} linkStyle={{ color: 'blue' }} />
```

### `matchers`

| Type              | Required | Default | Description                                                                                     |
| ----------------- | -------- | ------- | ----------------------------------------------------------------------------------------------- |
| `CustomMatcher[]` | No       |         | Array of custom matcher objects with optional press handlers, styling, and text/url extraction. |

See the [Custom Matchers](#custom-matchers) section below for more information.

```js
<Autolink text={text} matchers={[MyCustomMatcher]} />
```

### `mention`

| Type              | Required | Default | Description                                                                                                                            |
| ----------------- | -------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| boolean or string | No       | `false` | Whether to link mentions/handles to supplied service. Possible values: `false` (disabled), `"instagram"`, `"soundcloud"`, `"twitter"`. |

```js
<Autolink text={text} mention="instagram" />
```

### `onPress`

| Type     | Required | Default | Description                                                                             |
| -------- | -------- | ------- | --------------------------------------------------------------------------------------- |
| function | No       |         | Override default link press behavior. Signature: `(url: string, match: Match) => void`. |

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

| Type     | Required | Default | Description                                                                      |
| -------- | -------- | ------- | -------------------------------------------------------------------------------- |
| function | No       | none    | Handle link long press events. Signature: `(url: string, match: Match) => void`. |

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

| Type              | Required | Default | Description                                                                                                                        |
| ----------------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| boolean or string | No       | `true`  | Whether to link phone numbers. Possible values: `false` (disabled), `true` (`tel:{number}`), `"sms"` or `"text"` (`sms:{number}`). |

_Note:_ Currently, only US numbers are supported.

```js
<Autolink text={text} phone="sms" />
```

### `renderLink`

| Type     | Required | Default | Description                                                                                                            |
| -------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------------- |
| function | No       |         | Override default link rendering behavior. Signature: `(text: string, match: Match, index: number) => React.ReactNode`. |

_Note:_ You'll need to handle press logic yourself when using `renderLink`.

```js
<Autolink
  text={text}
  component={View}
  renderLink={(text, match) => <MyLinkPreviewComponent url={match.getAnchorHref()} />}
/>
```

### `renderText`

| Type     | Required | Default | Description                                                                                              |
| -------- | -------- | ------- | -------------------------------------------------------------------------------------------------------- |
| function | No       |         | Override default text rendering behavior. Signature: `(text: string, index: number) => React.ReactNode`. |

```js
<Autolink
  text={text}
  component={View}
  renderText={(text) => <MyTypographyComponent>{text}</MyTypographyComponent>}
/>
```

### `showAlert`

| Type    | Required | Default | Description                                                                            |
| ------- | -------- | ------- | -------------------------------------------------------------------------------------- |
| boolean | No       | `false` | Whether to display an alert before leaving the app (for privacy or accidental clicks). |

```js
<Autolink text={text} showAlert />
```

### `stripPrefix`

| Type    | Required | Default | Description                                                                               |
| ------- | -------- | ------- | ----------------------------------------------------------------------------------------- |
| boolean | No       | `true`  | Whether to strip protocol from URL link text (e.g. `https://github.com` -> `github.com`). |

```js
<Autolink text={text} stripPrefix={false} />
```

### `stripTrailingSlash`

| Type    | Required | Default | Description                                                                                |
| ------- | -------- | ------- | ------------------------------------------------------------------------------------------ |
| boolean | No       | `true`  | Whether to strip trailing slashes from URL link text (e.g. `github.com/` -> `github.com`). |

```js
<Autolink text={text} stripTrailingSlash={false} />
```

### `text`

| Type   | Required | Default | Description                    |
| ------ | -------- | ------- | ------------------------------ |
| string | Yes      |         | The string to parse for links. |

```js
<Autolink text={text} />
```

### `textProps`

| Type      | Required | Default | Description                                     |
| --------- | -------- | ------- | ----------------------------------------------- |
| TextProps | No       | `{}`    | Attributes applied to non-link Text components. |

```js
<Autolink text={text} textProps={{ selectable: false }} />
```

### `truncate`

| Type   | Required | Default | Description                                                                              |
| ------ | -------- | ------- | ---------------------------------------------------------------------------------------- |
| number | No       | `32`    | Maximum length of URL link text. Possible values: `0` (disabled), `1+` (maximum length). |

```js
<Autolink text={text} truncate={20} />
```

### `truncateChars`

| Type   | Required | Default | Description                                                                             |
| ------ | -------- | ------- | --------------------------------------------------------------------------------------- |
| string | No       | `..`    | Characters to replace truncated URL link text segments with (e.g. `github.com/../repo`) |

```js
<Autolink text={text} truncateChars="**" />
```

### `truncateLocation`

| Type   | Required | Default   | Description                                                                    |
| ------ | -------- | --------- | ------------------------------------------------------------------------------ |
| string | No       | `"smart"` | Override truncation location. Possible values: `"smart"`, `"end"`, `"middle"`. |

```js
<Autolink text={text} truncateLocation="end" />
```

### `url`

| Type              | Required | Default | Description                                                                                 |
| ----------------- | -------- | ------- | ------------------------------------------------------------------------------------------- |
| boolean or object | No       | `true`  | Whether to link URLs. Possible values: `false` (disabled), `true`, `UrlConfig` (see below). |

```js
type UrlConfig = {
  // Whether to link URLs prefixed with a scheme (e.g. https://github.com)
  schemeMatches?: boolean,
  // Whether to link URLs prefix with www (e.g. www.github.com)
  wwwMatches?: boolean,
  // Whether to link URLs with TLDs but not scheme or www prefixs (e.g. github.com)
  tldMatches?: boolean,
};
```

```js
<Autolink text={text} url={false} />
<Autolink text={text} url={{ tldMatches: false }} />
```

### `useNativeSchemes`

| Type    | Required | Default | Description                                                                                                                        |
| ------- | -------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| boolean | No       | `false` | Whether to use native app schemes (e.g. `twitter://`) rather than web URLs when linking to services for hashtag and mention links. |

_Note:_ Prior to v4, the `webFallback` prop enabled a check to see whether the user had a particular app installed using `Linking.canOpenUrl`, falling back to a web link if not. Due to permissions requirements on iOS and upcoming changes on Android, this feature was removed and instead, services will be linked to the web versions by default. Use the `useNativeSchemes` prop to enable native app linking or use the `onPress` and/or `matchers` props to provide your own custom logic for linking and opening apps.

## Custom Matchers

Custom matchers allow for complete customization of Autolink. You can match text based on a custom regular expression, supply custom `onPress` and `onLongPress` handlers, custom link styles, and even custom functions for creating the text and/or URL for the match.

Custom matchers are particularly useful for matching other types of data that aren't supported out-of-the-box (e.g. international phone numbers) and for mixing internal app navigation links with standard external links within the same block of content.

Check out the section below for a few [ready-to-go custom matchers](#available-matchers).

```ts
interface CustomMatcher {
  /* Regular expression pattern to match/link user-specified patterns */
  pattern: RegExp;
  /* Custom press handler for links of this type */
  onPress?: (match: CustomMatch) => void;
  /* Custom long-press handler for links of this type */
  onLongPress?: (match: CustomMatch) => void;
  /* Custom styling for links of this type */
  style?: StyleProp<TextStyle>;
  /* Custom type/identifier for use with match.getType() */
  type?: string;
  /* Custom function for extracting link text using regex replacer args */
  getLinkText?: (replacerArgs: ReplacerArgs) => string;
  /* Custom function for extracting link URL using regex replacer args */
  getLinkUrl?: (replacerArgs: ReplacerArgs) => string;
}
```

The `ReplacerArgs` type supplied to `getLinkText` and `getLinkUrl` is an array containing the variadic arguments passed to a replacer function as provided to `String.replace`. Essentially, element 0 is the entire matched link, and elements 1 through N are any captured subexpressions. More details can be found [in the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_function_as_a_parameter).

The `CustomMatch` class supplied to `onPress` and `onLongPress` (or their non-custom-matcher companions above) includes a few methods that can be useful as well, e.g. `getMatcher()` to return the `CustomMatcher` object and `getReplacerArgs` to return the same array discussed above.

### Custom Matcher Usage

When using the built-in link handling, the `getLinkUrl` function can be provided to determine the URL to which the link should navigate. Alternatively the `onPress` function will bypass that entirely, allowing the user to provide custom handling specific to this link type, e.g. for navigating within the application.

The following hypothetical example handles custom @-mention links of the format `@[Name](userId)`, navigating to a user profile screen:

```js
<Autolink
  text={text}
  matchers={[
    {
      pattern: /@\[([^[]*)]\(([^(^)]*)\)/g,
      style: { color: '#ff00ff' },
      getLinkText: (replacerArgs) => `@${replacerArgs[1]}`,
      onPress: (match) => {
        navigate('userProfile', { userId: match.getReplacerArgs()[2] });
      },
    },
  ]}
/>
```

### Available Matchers

A few custom matchers (e.g. `LatLngMatcher`, `IntlPhoneMatcher`, `PhoneMatchersByCountry`) are already included and available for use. They're just objects so they're easily customizable too! PRs are welcome for additional custom matchers that could be useful to the community.

```js
import { Autolink, LatLngMatcher } from 'react-native-autolink';

<Autolink text="Some text with locations 32.123, -117.123" matchers={[LatLngMatcher]} />;

// Or customize the matcher
const MyLatLngMatcher = { ...LatLngMatcher, onPress: () => alert('LatLng pressed!') };

<Autolink text={text} matchers={[MyLatLngMatcher]} />;
```

## Supported By

<a href="https://www.disruptivelabs.io">
  <img src="https://www.disruptivelabs.io/images/logo.png" alt="Disruptive Labs" width="150" />
</a>

## License

```text
 Copyright (c) 2016-2021 Josh Swan

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
