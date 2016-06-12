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
        text="This is the string to parse for urls (https://github.com/joshswan/react-native-autolink), phone numbers (415-555-5555), emails (josh@sportifik.com), twitter handles (@twitter), and hashtags (#exciting)"
        hashtag="instagram"
        twitter />
    );
  }
}
```

## Props

###### Required
* `text`: String to parse for links

###### Optional
* `email`: Enable email linking (`mailto://{email}`). Values: `true`, `false`. Default: `true`.
* `hashtag`: Enable hashtag linking to supplied service (`facebook://hashtag/{hashtag}`). Values: `false`, `"facebook"`, `"instagram"`, `"twitter"`. Default: `false`.
* `phone`: Enable phone linking (`tel://{number}`). Values: `true`, `false`. Default `true`.
* `twitter`: Enable twitter handle linking (`twitter://user?screen_name={handle}`). Values: `true`, `false`. Default: `false`.
* `url`: Enable url linking (`https://{url}`). Values: `true`, `false`. Default: `true`.
* `stripPrefix`: Enable stripping of protocol (https://url -> url). Values: `true`, `false`. Default: `true`.
* `style`: Custom styles to apply to parent Text node.
* `linkStyle`: Custom styles to apply to Text nodes of links.
* `onPress`: Custom function handler for link press events. Arguments: `link:String`, `match:Object` ([Autolinker.js match object](http://gregjacobs.github.io/Autolinker.js/docs/#!/api/Autolinker.match.Match))
* `renderLink`: Custom render function for rendering link nodes. Arguments: `text:String`, `link:String`, `match:Object` ([Autolinker.js match object](http://gregjacobs.github.io/Autolinker.js/docs/#!/api/Autolinker.match.Match))
* `truncate`: Truncate long link text for display (e.g. https://www.google.com/../something.html). Values: `0` to disable, `1+` to truncate to that maximum length. Default: `32`.
* `truncateChars`: Characters to replace truncated url segment with, if enabled. Values: `String`. Default: `..`.

[build-url]: https://travis-ci.org/joshswan/react-native-autolink
[build-image]: https://travis-ci.org/joshswan/react-native-autolink.svg?branch=master
[depstat-url]: https://david-dm.org/joshswan/react-native-autolink
[depstat-image]: https://david-dm.org/joshswan/react-native-autolink.svg
[devdepstat-url]: https://david-dm.org/joshswan/react-native-autolink#info=devDependencies
[devdepstat-image]: https://david-dm.org/joshswan/react-native-autolink/dev-status.svg
[npm-url]: https://www.npmjs.com/package/react-native-autolink
[npm-image]: https://badge.fury.io/js/react-native-autolink.svg
