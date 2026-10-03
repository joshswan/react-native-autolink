import React, { act } from 'react';
import { Text } from 'react-native';
import renderer, { ReactTestRenderer } from 'react-test-renderer';
import { Autolink } from '../Autolink';
import { CustomMatch } from '../CustomMatch';

// React 19 renders asynchronously, so wrap rendering in act() to flush it.
const create = (element: React.ReactElement) => {
  let root!: ReactTestRenderer;
  act(() => {
    root = renderer.create(element);
  });
  return root;
};

describe('custom matcher isolation', () => {
  test('keeps URL, hashtag, and username links intact with built-in URL matching enabled', () => {
    const onHashtagPress = jest.fn();
    const onUserPress = jest.fn();
    const text =
      "I am linking to https://google.com because I'm a #corporateshill. All hail @google!";
    const tree = create(
      <Autolink
        text={text}
        stripPrefix={false}
        matchers={[
          { pattern: /#([a-z0-9_-]+)/g, onPress: onHashtagPress },
          { pattern: /@([a-z0-9_.]+)/g, onPress: onUserPress },
        ]}
      />,
    );
    const links = tree.root.findAllByType(Text).filter((node) => node.props.onPress);
    expect(links.map((node) => node.props.children)).toEqual([
      'https://google.com',
      '#corporateshill',
      '@google',
    ]);
    links[1].props.onPress();
    links[2].props.onPress();
    expect(onHashtagPress.mock.calls[0][0].getMatchedText()).toBe('#corporateshill');
    expect(onUserPress.mock.calls[0][0].getMatchedText()).toBe('@google');
  });

  test('preserves earlier custom matches beside a later matcher', () => {
    const tree = create(
      <Autolink text="#tag@user" matchers={[{ pattern: /#\w+/g }, { pattern: /@\w+/g }]} />,
    );
    const links = tree.root.findAllByType(Text).filter((node) => node.props.onPress);
    expect(links.map((node) => node.props.children)).toEqual(['#tag', '@user']);
  });

  test('does not match generated tokens with a broad custom regex', () => {
    const tree = create(
      <Autolink text="https://example.com hello" matchers={[{ pattern: /\S+/g }]} />,
    );
    const links = tree.root.findAllByType(Text).filter((node) => node.props.onPress);
    expect(links.map((node) => node.props.children)).toEqual(['example.com', 'hello']);
  });

  test('reports custom captures and offsets relative to the original input', () => {
    const onPress = jest.fn();
    const text = 'https://example.com @user';
    const tree = create(
      <Autolink text={text} matchers={[{ pattern: /@(?<name>\w+)/g, onPress }]} />,
    );
    const links = tree.root.findAllByType(Text).filter((node) => node.props.onPress);
    links[1].props.onPress();
    const match: CustomMatch = onPress.mock.calls[0][0];
    expect(match.getOffset()).toBe(text.indexOf('@user'));
    expect(match.getReplacerArgs()).toEqual([
      '@user',
      'user',
      text.indexOf('@user'),
      text,
      { name: 'user' },
    ]);
  });

  test('applies a non-global matcher once outside existing links', () => {
    const renderLink = jest.fn((text: string, _match, index: number) => (
      <Text key={index}>{text}</Text>
    ));
    create(
      <Autolink
        text="https://example.com example example"
        matchers={[{ pattern: /example/ }]}
        renderLink={renderLink}
      />,
    );
    expect(renderLink.mock.calls.map(([text]) => text)).toEqual(['example.com', 'example']);
  });

  test('preserves full-input anchors and the precedence of earlier matchers', () => {
    const renderLink = jest.fn((text: string, _match, index: number) => (
      <Text key={index}>{text}</Text>
    ));
    create(
      <Autolink
        text="https://example.com foo #tag"
        matchers={[{ pattern: /#tag/g }, { pattern: /^foo|tag/g }]}
        renderLink={renderLink}
      />,
    );
    expect(renderLink.mock.calls.map(([text]) => text)).toEqual(['example.com', '#tag']);
  });

  test('keeps unicode text, punctuation, and whitespace around multiple links', () => {
    const renderLink = jest.fn((text: string) => text);
    const renderText = jest.fn((text: string) => text);
    const text = 'Chào 👋 @one\nhttps://example.com, @two!';
    const tree = create(
      <Autolink
        text={text}
        stripPrefix={false}
        matchers={[{ pattern: /@\w+/g }]}
        renderLink={renderLink}
        renderText={renderText}
      />,
    );
    expect(tree.root.findByType(Text).props.children.join('')).toBe(text);
    expect(renderLink.mock.calls.map(([value]) => value)).toEqual([
      '@one',
      'https://example.com',
      '@two',
    ]);
  });

  test('handles zero-length matches without losing text or matching inside a link', () => {
    const renderLink = jest.fn((text: string, _match, index: number) => (
      <Text key={index}>{text}</Text>
    ));
    create(
      <Autolink
        text="https://example.com foo"
        matchers={[{ pattern: /(?=example)|(?=foo)/g }]}
        renderLink={renderLink}
      />,
    );
    expect(renderLink.mock.calls.map(([text]) => text)).toEqual(['example.com', '']);
  });

  test('honors the starting offset of a non-global sticky regex', () => {
    const pattern = /@\w+/y;
    pattern.lastIndex = 3;
    const tree = create(<Autolink text="hi @user @other" matchers={[{ pattern }]} />);
    const links = tree.root.findAllByType(Text).filter((node) => node.props.onPress);
    expect(links.map((node) => node.props.children)).toEqual(['@user']);
  });
});
