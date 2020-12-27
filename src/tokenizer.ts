const LINEBREAK = /\r?\n|\r/;
const WHITESPACE = /\s/;
const NUMBERS = /\d/;
const IDENTIFIERS = /[a-z0-9_\-@]/i;

export interface Token {
  type: 'assignment' | 'bracket' | 'boolean' | 'comment' | 'comparison' | 'identifier' | 'number' | 'string';
  value: string;
}

const makeIdentifier = (value: string): Token => {
  if (value === 'yes' || value === 'no') {
    return { type: 'boolean', value };
  } else {
    return { type: 'identifier', value };
  }
};

export const tokenize = (text: string): Array<Token> => {
  const tokens: Array<Token> = [];

  let current = 0;
  while (current < text.length) {
    let c = text[current];

    if (c === '#') {
      let value = '';
      c = text[++current];

      while (!LINEBREAK.test(c)) {
        value += c;
        c = text[++current];
      }

      tokens.push({ type: 'comment', value: value.trim() });
      continue;
    }

    if (c === '{' || c === '}') {
      tokens.push({
        type: 'bracket',
        value: c,
      });
      current++;
      continue;
    }

    if (WHITESPACE.test(c)) {
      current++;
      continue;
    }

    if (c === '=') {
      tokens.push({ type: 'assignment', value: c });
      current++;
      continue;
    }

    if (c === '<' || c === '>') {
      let value = c;

      current++;
      c = text[current];

      if (c === '=') {
        value += c;
        tokens.push({ type: 'comparison', value });
        current++;
      } else {
        tokens.push({ type: 'comparison', value });
      }

      continue;
    }

    if (NUMBERS.test(c) || c === '-') {
      let value = '';
      let isDefinitelyNumber = false;

      if (c === '-') {
        value += c;
        c = text[++current];
        isDefinitelyNumber = true;
      }

      while (NUMBERS.test(c) || c === '.') {
        value += c;
        c = text[++current];

        if (c === '.') {
          isDefinitelyNumber = true;
        }
      }

      if (!isDefinitelyNumber && IDENTIFIERS.test(c)) {
        while (IDENTIFIERS.test(c)) {
          value += c;
          c = text[++current];
        }

        tokens.push(makeIdentifier(value));
        continue;
      }

      tokens.push({ type: 'number', value });
      continue;
    }

    if (c === '"') {
      let value = '';

      c = text[++current];
      while (c !== '"') {
        value += c;
        c = text[++current];
      }

      c = text[++current];

      tokens.push({ type: 'string', value });
      continue;
    }

    if (IDENTIFIERS.test(c)) {
      let value = '';

      while (IDENTIFIERS.test(c)) {
        value += c;
        c = text[++current];
      }

      tokens.push(makeIdentifier(value));
      continue;
    }

    throw new TypeError('Unexpected character: ' + c);
  }

  return tokens;
};
