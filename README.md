# React Native AutoLink
[![NPM Version][npm-image]][npm-url] [![Build Status][build-image]][build-url] [![Dependency Status][depstat-image]][depstat-url] [![Dev Dependency Status][devdepstat-image]][devdepstat-url]

Auto-Linking component for React Native. Parses text and wraps URLs, phone numbers, emails, twitter handles, and hashtags with Text nodes and onPress handlers using the [Autolinker.js](https://github.com/gregjacobs/Autolinker.js).

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
      <AutoLink
        text="This is the string to parse for urls (https://github.com/joshswan/react-native-autolink), phone numbers (415-555-5555), emails (josh@sportifik.com), mentions/handles (@twitter), and hashtags (#exciting)"
        hashtag="instagram"
        mention="twitter" />
    );
  }
}
```

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `text` | `String` | | ***Required.*** The string to parse for links. |
| `email` | `Boolean` | `true` | Enable email linking (`mailto:{email}`). |
| `hashtag` | `Boolean/String` | `false` | Enable hashtag linking to supplied service. Possible values: `false`, `"instagram"`, `"twitter"`. |
| `mention` | `Boolean/String` | `false` | Enable mention/handle linking to supplied service. Possible values: `false`, `"instagram"`, `"twitter"`. |
| `phone` | `Boolean` | `true` | Enable phone linking (`tel://{number}`). |
| `twitter` | `Boolean` | `false` | **DEPRECATED. Use `mention` prop.** Enable Twitter handle linking (`twitter://user?screen_name={handle}`). |
| `url` | `Boolean` | `true` | Enable url linking (`https://{url}`). |
| `stripPrefix` | `Boolean` | `true` | Enable stripping of protocol from link text (`https://url` -> `url`). |
| `linkStyle` | `TextStyle` | | Custom styling to apply to Text nodes of links. |
| `onPress` | `function` | | Custom function handler for link press events. Arguments: `link:String`, `match:Object`. *See [Autolinker.js match object](http://gregjacobs.github.io/Autolinker.js/docs/#!/api/Autolinker.match.Match) for more information about the match object.* |
| `renderLink` | `function` | | Custom render function for rendering link nodes. Arguments: `text:String`, `link:String`, `match:Object`. *See [Autolinker.js match object](http://gregjacobs.github.io/Autolinker.js/docs/#!/api/Autolinker.match.Match) for more information about the match object.* |
| `truncate` | `Number` | `32` | Truncate long link text for display (e.g. `https://www.google.com/../something.html`). Possible values: `0` to disable, `1+` to truncate to that maximum length. |
| `truncateChars` | `String` | `..` | Characters to replace truncated url segments with, if enabled. |
| `webFallback` | `Boolean` | Android: `true` iOS: `false` | Link to web versions of Instagram/Twitter for hashtag and mention links when users don't have the respective app installed. **Requires `LSApplicationQueriesSchemes` on iOS. See: https://facebook.github.io/react-native/docs/linking.html |

**Any other props will be passed through to the main Text node (e.g. style, numberOfLines).**

[build-url]: https://travis-ci.org/joshswan/react-native-autolink
[build-image]: https://travis-ci.org/joshswan/react-native-autolink.svg?branch=master
[depstat-url]: https://david-dm.org/joshswan/react-native-autolink
[depstat-image]: https://david-dm.org/joshswan/react-native-autolink.svg
[devdepstat-url]: https://david-dm.org/joshswan/react-native-autolink#info=devDependencies
[devdepstat-image]: https://david-dm.org/joshswan/react-native-autolink/dev-status.svg
[npm-url]: https://www.npmjs.com/package/react-native-autolink
[npm-image]: https://badge.fury.io/js/react-native-autolink.svg
