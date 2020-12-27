import * as t from '../src/types';
import { transform } from '../src/transformer';

it('merges duplicate object properties', () => {
  const ast = t.objectExpression([
    t.objectProperty(
      'has_monthly_income',
      t.objectExpression([
        t.objectProperty('resource', t.stringLiteral('energy')),
        t.objectProperty('value', t.arrayExpression([t.stringLiteral('>='), t.numericLiteral(1)])),
      ])
    ),
    t.objectProperty(
      'has_monthly_income',
      t.objectExpression([
        t.objectProperty('resource', t.stringLiteral('minerals')),
        t.objectProperty('value', t.arrayExpression([t.stringLiteral('>='), t.numericLiteral(1)])),
      ])
    ),
  ]);

  const expectedAst = t.objectExpression([
    t.objectProperty(
      'has_monthly_income',
      t.arrayExpression([
        t.objectExpression([
          t.objectProperty('resource', t.stringLiteral('energy')),
          t.objectProperty('value', t.arrayExpression([t.stringLiteral('>='), t.numericLiteral(1)])),
        ]),
        t.objectExpression([
          t.objectProperty('resource', t.stringLiteral('minerals')),
          t.objectProperty('value', t.arrayExpression([t.stringLiteral('>='), t.numericLiteral(1)])),
        ]),
      ])
    ),
  ]);

  transform(ast);

  expect(ast).toEqual(expectedAst);
});
