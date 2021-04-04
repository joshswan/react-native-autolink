import { EmailMatch, HashtagMatch, MentionMatch, PhoneMatch } from 'autolinker/dist/es2015';

export const getEmailUrl = (match: EmailMatch): string =>
  `mailto:${encodeURIComponent(match.getEmail())}`;

export const getHashtagUrl = (
  match: HashtagMatch,
  service: 'facebook' | 'instagram' | 'twitter' | false = false,
  native = false,
): string => {
  const tag = encodeURIComponent(match.getHashtag());

  switch (service) {
    case 'facebook':
      return native ? `fb://hashtag/${tag}` : `https://www.facebook.com/hashtag/${tag}`;
    case 'instagram':
      return native
        ? `instagram://tag?name=${tag}`
        : `https://www.instagram.com/explore/tags/${tag}/`;
    case 'twitter':
      return native ? `twitter://search?query=%23${tag}` : `https://twitter.com/hashtag/${tag}`;
    default:
      return match.getMatchedText();
  }
};

export const getMentionUrl = (
  match: MentionMatch,
  service: 'instagram' | 'soundcloud' | 'twitter' | false = false,
  native = false,
): string => {
  const username = match.getMention();

  switch (service) {
    case 'instagram':
      return native
        ? `instagram://user?username=${username}`
        : `https://www.instagram.com/${username}/`;
    case 'soundcloud':
      return `https://soundcloud.com/${username}`;
    case 'twitter':
      return native ? `twitter://user?screen_name=${username}` : `https://twitter.com/${username}`;
    default:
      return match.getMatchedText();
  }
};

export const getPhoneUrl = (
  match: PhoneMatch,
  method: 'sms' | 'tel' | 'text' | boolean = 'tel',
): string => {
  const number = (match as PhoneMatch).getNumber();

  switch (method) {
    case 'sms':
    case 'text':
      return `sms:${number}`;
    default:
      return `tel:${number}`;
  }
};
