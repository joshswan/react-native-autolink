import { EmailMatch, HashtagMatch, MentionMatch, PhoneMatch } from 'autolinker/dist/es2015';
import { getEmailUrl, getHashtagUrl, getMentionUrl, getPhoneUrl } from '../urls';

describe('urls', () => {
  describe('getEmailUrl()', () => {
    test('returns mailto url', () => {
      expect(getEmailUrl(new EmailMatch({ email: 'test@example.com' } as any))).toEqual([
        'mailto:test%40example.com',
      ]);
    });
  });

  describe('getHashtagUrl()', () => {
    test('returns facebook hashtag url with fallback', () => {
      expect(getHashtagUrl(new HashtagMatch({ hashtag: 'awesome' } as any), 'facebook')).toEqual([
        'fb://hashtag/awesome',
        'https://www.facebook.com/hashtag/awesome',
      ]);
    });

    test('returns instagram hashtag url with fallback', () => {
      expect(getHashtagUrl(new HashtagMatch({ hashtag: 'awesome' } as any), 'instagram')).toEqual([
        'instagram://tag?name=awesome',
        'https://www.instagram.com/explore/tags/awesome/',
      ]);
    });

    test('returns twitter hashtag url with fallback', () => {
      expect(getHashtagUrl(new HashtagMatch({ hashtag: 'awesome' } as any), 'twitter')).toEqual([
        'twitter://search?query=%23awesome',
        'https://twitter.com/hashtag/awesome',
      ]);
    });

    test('returns matched text if service does not match any supported service', () => {
      expect(getHashtagUrl(new HashtagMatch({ matchedText: '#awesome' } as any), false)).toEqual([
        '#awesome',
      ]);
    });
  });

  describe('getMentionUrl()', () => {
    test('returns instagram mention url with fallback', () => {
      expect(getMentionUrl(new MentionMatch({ mention: 'username' } as any), 'instagram')).toEqual([
        'instagram://user?username=username',
        'https://www.instagram.com/username/',
      ]);
    });

    test('returns soundcloud mention url', () => {
      expect(
        getMentionUrl(new MentionMatch({ mention: 'username' } as any), 'soundcloud'),
      ).toEqual(['https://soundcloud.com/username']);
    });

    test('returns twitter mention url with fallback', () => {
      expect(getMentionUrl(new MentionMatch({ mention: 'username' } as any), 'twitter')).toEqual([
        'twitter://user?screen_name=username',
        'https://twitter.com/username',
      ]);
    });

    test('returns matched text if service does not match any supported service', () => {
      expect(getMentionUrl(new MentionMatch({ matchedText: '@username' } as any), false)).toEqual([
        '@username',
      ]);
    });
  });

  describe('getPhoneUrl()', () => {
    test('returns sms/text url', () => {
      expect(getPhoneUrl(new PhoneMatch({ number: '+14085550123' } as any), 'sms')).toEqual([
        'sms:+14085550123',
      ]);
      expect(getPhoneUrl(new PhoneMatch({ number: '+14085550123' } as any), 'text')).toEqual([
        'sms:+14085550123',
      ]);
    });

    test('returns tel url by default', () => {
      expect(getPhoneUrl(new PhoneMatch({ number: '+14085550123' } as any), 'tel')).toEqual([
        'tel:+14085550123',
      ]);
      expect(getPhoneUrl(new PhoneMatch({ number: '+14085550123' } as any))).toEqual([
        'tel:+14085550123',
      ]);
    });
  });
});
