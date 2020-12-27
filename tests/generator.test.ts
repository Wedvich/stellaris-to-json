import * as t from '../src/types';
import { generate } from '../src/generator';

it('generates empty JSON', () => {
  const ast = t.objectExpression([]);

  const json = generate(ast);

  expect(json).toEqual('{}');
});

it('generates JSON with primitive properties', () => {
  const ast = t.objectExpression([
    t.objectProperty('a', t.booleanLiteral(true)),
    t.objectProperty('b', t.numericLiteral(1)),
    t.objectProperty('c', t.stringLiteral('hello')),
  ]);

  const json = generate(ast);

  expect(json).toEqual('{"a":true,"b":1,"c":"hello"}');
});

it('ignores unhandled nodes', () => {
  const ast = t.arrayExpression([t.endOfFile()]);

  const json = generate(ast);

  expect(json).toEqual('[]');
});
