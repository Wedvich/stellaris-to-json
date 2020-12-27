import { tokenize } from './tokenizer';
import { parse } from './parser';
import { transform } from './transformer';
import { generate } from './generator';
import * as t from './types';

export const convert = (text: string): string => {
  if (!text) {
    return generate(t.objectExpression([]));
  }

  const tokens = tokenize(text);
  let ast: t.AstNode = parse(tokens);

  if (ast.properties.every(p => (p.type as unknown) === t.AstNodeType.string)) {
    ast = t.arrayExpression(ast.properties);
  } else {
    transform(ast); // TODO: Don't mutate?
  }

  return generate(ast);
};
