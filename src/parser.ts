import type { Token } from './tokenizer';
import * as t from './types';

const isArray = (tokens: Array<Token>, current: number): boolean => {
  const token = tokens[current];

  let nextToken = tokens[current + 1];
  let nextIndex = current + 1;
  while (nextToken?.type === 'comment') {
    nextToken = tokens[++nextIndex];
  }

  return token?.type === nextToken?.type || (nextToken?.type === 'bracket' && nextToken.value === '}');
};

export const parse = (tokens: Array<Token>): t.ObjectExpression => {
  let current = 0;
  const walk = (): t.AstNode => {
    let token = tokens[current];
    while (token.type === 'comment') {
      token = tokens[++current];
      if (!token) {
        return t.endOfFile();
      }
    }

    if (token.type === 'number') {
      current++;
      return t.numericLiteral(Number(token.value));
    }

    if (token.type === 'string') {
      const nextToken = tokens[++current];
      if (nextToken?.type === 'assignment') {
        current++;
        return t.objectProperty(token.value, walk());
      }

      return t.stringLiteral(token.value);
    }

    if (token.type === 'boolean') {
      current++;
      return t.booleanLiteral(token.value === 'yes');
    }

    if (token.type === 'identifier') {
      const nextToken = tokens[++current];
      if (nextToken?.type === 'assignment') {
        const nextToken2 = tokens[++current];
        if (nextToken2.type === 'identifier') {
          current++;
          return t.objectProperty(token.value, t.stringLiteral(nextToken2.value));
        }
        return t.objectProperty(token.value, walk());
      }

      if (nextToken?.type === 'comparison') {
        const nextToken2 = tokens[++current];
        current++;
        return t.objectProperty(
          token.value,
          t.arrayExpression([
            t.stringLiteral(nextToken.value),
            nextToken2.type === 'number'
              ? t.numericLiteral(Number(nextToken2.value))
              : t.stringLiteral(nextToken2.value),
          ])
        );
      }

      return t.stringLiteral(token.value);
    }

    if (token.type === 'bracket' && token.value === '{') {
      token = tokens[++current];

      if (isArray(tokens, current)) {
        const node = t.arrayExpression([]);
        while (token.type !== 'bracket' || (token.type === 'bracket' && token.value !== '}')) {
          if (token.type === 'comment') {
            token = tokens[++current];
            continue;
          }

          node.elements.push(walk());
          token = tokens[current];
        }

        current++;
        return node;
      }

      const node = t.objectExpression([]);
      while (token.type !== 'bracket' || (token.type === 'bracket' && token.value !== '}')) {
        if (token.type === 'comment') {
          token = tokens[++current];
          continue;
        }

        node.properties.push(walk() as t.ObjectProperty);
        token = tokens[current];
      }

      current++;
      return node;
    }

    throw new TypeError('Unexpected token: ' + token.type);
  };

  const ast = t.objectExpression([]);
  while (current < tokens.length) {
    ast.properties.push(walk() as t.ObjectProperty);
  }

  ast.properties = ast.properties.filter((node: t.AstNode) => node.type !== t.AstNodeType.endOfFile);

  return ast;
};
