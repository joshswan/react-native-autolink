import { Match, MatchConfig } from 'autolinker/dist/es2015';
import { StyleProp, TextStyle } from 'react-native';

// The variadic arguments of a regex replacer function, wrapped in an array.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReplacerArgs = [string, ...any[]];

export interface CustomMatcher {
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

export interface CustomMatchConfig extends MatchConfig {
  matcher: CustomMatcher;
  replacerArgs: ReplacerArgs;
}

export class CustomMatch extends Match {
  private matcher: CustomMatcher;
  private replacerArgs: ReplacerArgs;

  constructor({ matcher, replacerArgs, ...config }: CustomMatchConfig) {
    super(config);

    this.matcher = matcher;
    this.replacerArgs = replacerArgs;
  }

  getType(): string {
    return this.matcher.type || 'custom';
  }

  getAnchorHref(): string {
    return this.matcher.getLinkUrl?.(this.replacerArgs) ?? this.matchedText;
  }

  getAnchorText(): string {
    return this.matcher.getLinkText?.(this.replacerArgs) ?? this.matchedText;
  }

  getMatcher(): CustomMatcher {
    return this.matcher;
  }
}
