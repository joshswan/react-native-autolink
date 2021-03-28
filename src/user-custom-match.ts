import { Match, MatchConfig } from 'autolinker/dist/es2015';
import { StyleProp, TextStyle } from 'react-native';

// The variadic arguments of a regex replacer function, wrapped in an array.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReplacerArgs = [string, ...any[]];

export interface UserCustomMatchSpec {
  /** Regular expression pattern to match user-specified custom links */
  pattern: RegExp;
  /** Custom function for extracting link text from regex replacer args */
  extractText?: (replacerArgs: ReplacerArgs) => string;
  /** Custom function for extracting link URL from regex replacer args */
  extractUrl?: (replacerArgs: ReplacerArgs) => string;
  /** Custom override for styling links of this type */
  style?: StyleProp<TextStyle>;
  /** Custom override for handling presses on links of this type */
  onPress?: (replacerArgs: ReplacerArgs) => void;
  /** Custom override for handling long-presses on links of this type */
  onLongPress?: (replacerArgs: ReplacerArgs) => void;
}

export interface UserCustomMatchConfig extends MatchConfig, UserCustomMatchSpec {
  replacerArgs: ReplacerArgs;
}

export class UserCustomMatch extends Match {
  private replacerArgs: ReplacerArgs;

  private extractUrl?: (replacerArgs: ReplacerArgs) => string;

  private extractText?: (replacerArgs: ReplacerArgs) => string;

  private style?: StyleProp<TextStyle>;

  private onPress?: () => void;

  private onLongPress?: () => void;

  constructor(cfg: UserCustomMatchConfig) {
    super(cfg);

    this.replacerArgs = cfg.replacerArgs;
    this.extractUrl = cfg.extractUrl;
    this.extractText = cfg.extractText;
    this.style = cfg.style;

    const { onPress, onLongPress } = cfg;
    if (onPress) {
      this.onPress = () => onPress(this.replacerArgs);
    }
    if (onLongPress) {
      this.onLongPress = () => onLongPress(this.replacerArgs);
    }
  }

  getType(): string {
    return 'userCustom';
  }

  getAnchorHref(): string {
    return this.extractUrl?.(this.replacerArgs) ?? this.matchedText;
  }

  getAnchorText(): string {
    return this.extractText?.(this.replacerArgs) ?? this.matchedText;
  }

  getStyle(): StyleProp<TextStyle> | undefined {
    return this.style;
  }

  getOnPress(): (() => void) | undefined {
    return this.onPress;
  }

  getOnLongPress(): (() => void) | undefined {
    return this.onLongPress;
  }
}
