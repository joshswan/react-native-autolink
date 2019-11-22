import { StyleProp, TextStyle } from 'react-native';

export interface AutolinkProps {
  email?: boolean;
  hashtag?: false|'facebook'|'instagram'|'twitter';
  latlng?: boolean;
  linkStyle?: StyleProp<TextStyle>;
  mention?: false|'instagram'|'soundcloud'|'twitter';
  onPress?: (url: string, match: string) => void;
  onLongPress?: (url: string, match: string) => void;
  phone?: boolean|string;
  renderLink?: (text: string, match: string, index: number) => void;
  showAlert?: boolean;
  stripPrefix?: boolean;
  stripTrailingSlash?: boolean;
  style?: StyleProp<TextStyle>;
  text: string;
  truncate?: number;
  truncateChars?: string;
  truncateLocation?: 'end'|'middle'|'smart';
  twitter?: boolean;
  url?: boolean | { schemeMatches?: boolean; wwwMatches?: boolean; tldMatches?: boolean; };
  webFallback?: boolean;
}

export default class Autolink extends React.PureComponent<AutolinkProps> {
}

