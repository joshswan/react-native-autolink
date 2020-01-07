import { PureComponent } from 'react';
import { StyleProp, TextStyle, TextProps } from 'react-native';
import { Match } from 'autolinker';

export interface AutolinkProps {
  email?: boolean;
  hashtag?: false | 'facebook' | 'instagram' | 'twitter';
  latlng?: boolean;
  linkStyle?: StyleProp<TextStyle>;
  mention?: false | 'instagram' | 'soundcloud' | 'twitter';
  onPress?: (url: string, match: Match) => void;
  onLongPress?: (url: string, match: Match) => void;
  phone?: boolean | 'text';
  renderLink?: (text: string, match: Match, index: number) => void;
  showAlert?: boolean;
  stripPrefix?: boolean;
  stripTrailingSlash?: boolean;
  text: string;
  truncate?: number;
  truncateChars?: string;
  truncateLocation?: 'end' | 'middle' | 'smart';
  /**
   * @deprecated Use mention
   */
  twitter?: boolean;
  url?:
      | boolean
      | { schemeMatches?: boolean; wwwMatches?: boolean; tldMatches?: boolean };
  webFallback?: boolean;
}

export default class Autolink extends PureComponent<
  AutolinkProps & TextProps
> {}
