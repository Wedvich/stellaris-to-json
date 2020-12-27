import * as t from '../src/types';
import { parse } from '../src/parser';
import type { Token } from '../src/tokenizer';

it('parses variables', () => {
  const tokens: Array<Token> = [
    { type: 'identifier', value: '@s_t1_cost' },
    { type: 'assignment', value: '=' },
    { type: 'number', value: '1' },
  ];

  const ast = parse(tokens);

  expect(ast).toEqual(t.objectExpression([t.objectProperty('@s_t1_cost', t.numericLiteral(1))]));
});

it('parses objects', () => {
  const tokens: Array<Token> = [
    { type: 'identifier', value: 'component_set' },
    { type: 'assignment', value: '=' },
    { type: 'bracket', value: '{' },
    { type: 'identifier', value: 'key' },
    { type: 'assignment', value: '=' },
    { type: 'string', value: 'combat_computers' },
    { type: 'bracket', value: '}' },
  ];

  const ast = parse(tokens);

  expect(ast).toEqual(
    t.objectExpression([
      t.objectProperty(
        'component_set',
        t.objectExpression([t.objectProperty('key', t.stringLiteral('combat_computers'))])
      ),
    ])
  );
});

it('parses arrays with multiple elements', () => {
  const tokens: Array<Token> = [
    { type: 'identifier', value: 'ai_tags' },
    { type: 'assignment', value: '=' },
    { type: 'bracket', value: '{' },
    { type: 'identifier', value: 'weapon_role_anti_shield' },
    { type: 'identifier', value: 'weapon_role_anti_armor' },
    { type: 'bracket', value: '}' },
  ];

  const ast = parse(tokens);
  expect(ast).toEqual(
    t.objectExpression([
      t.objectProperty(
        'ai_tags',
        t.arrayExpression([t.stringLiteral('weapon_role_anti_shield'), t.stringLiteral('weapon_role_anti_armor')])
      ),
    ])
  );
});

it('parses arrays with a single element', () => {
  const tokens: Array<Token> = [
    { type: 'identifier', value: 'ai_tags' },
    { type: 'assignment', value: '=' },
    { type: 'bracket', value: '{' },
    { type: 'identifier', value: 'weapon_role_anti_armor' },
    { type: 'bracket', value: '}' },
  ];

  const ast = parse(tokens);
  expect(ast).toEqual(
    t.objectExpression([t.objectProperty('ai_tags', t.arrayExpression([t.stringLiteral('weapon_role_anti_armor')]))])
  );
});

it('parses logic statements', () => {
  const tokens: Array<Token> = [
    { type: 'identifier', value: 'has_monthly_income' },
    { type: 'assignment', value: '=' },
    { type: 'bracket', value: '{' },
    { type: 'identifier', value: 'resource' },
    { type: 'assignment', value: '=' },
    { type: 'identifier', value: 'minerals' },
    { type: 'identifier', value: 'value' },
    { type: 'comparison', value: '>' },
    { type: 'number', value: '999' },
    { type: 'bracket', value: '}' },
  ];

  const ast = parse(tokens);
  expect(ast).toEqual(
    t.objectExpression([
      t.objectProperty(
        'has_monthly_income',
        t.objectExpression([
          t.objectProperty('resource', t.stringLiteral('minerals')),
          t.objectProperty('value', t.arrayExpression([t.stringLiteral('>'), t.numericLiteral(999)])),
        ])
      ),
    ])
  );
});

it('throws a TypeError when it encounters an unexpected token', () => {
  const tokens: Array<Token> = [
    { type: 'bracket', value: '{' },
    { type: 'assignment', value: '=' },
  ];

  expect(() => parse(tokens)).toThrow({
    message: 'Unexpected token: assignment',
    name: TypeError.name,
  });
});

it('supports comparison by variables', () => {
  const tokens: Array<Token> = [
    { type: 'identifier', value: 'has_monthly_income' },
    { type: 'assignment', value: '=' },
    { type: 'bracket', value: '{' },
    { type: 'identifier', value: 'resource' },
    { type: 'assignment', value: '=' },
    { type: 'identifier', value: 'minerals' },
    { type: 'identifier', value: 'value' },
    { type: 'comparison', value: '>' },
    { type: 'identifier', value: '@cost' },
    { type: 'bracket', value: '}' },
  ];

  const ast = parse(tokens);
  expect(ast).toEqual(
    t.objectExpression([
      t.objectProperty(
        'has_monthly_income',
        t.objectExpression([
          t.objectProperty('resource', t.stringLiteral('minerals')),
          t.objectProperty('value', t.arrayExpression([t.stringLiteral('>'), t.stringLiteral('@cost')])),
        ])
      ),
    ])
  );
});

it('supports string identifiers', () => {
  const tokens: Array<Token> = [
    { type: 'identifier', value: 'section_slots' },
    { type: 'assignment', value: '=' },
    { type: 'bracket', value: '{' },
    { type: 'string', value: 'mid' },
    { type: 'assignment', value: '=' },
    { type: 'bracket', value: '{' },
    { type: 'identifier', value: 'locator' },
    { type: 'assignment', value: '=' },
    { type: 'string', value: 'part1' },
    { type: 'bracket', value: '}' },
    { type: 'bracket', value: '}' },
  ];

  const ast = parse(tokens);
  expect(ast).toEqual(
    t.objectExpression([
      t.objectProperty(
        'section_slots',
        t.objectExpression([
          t.objectProperty('mid', t.objectExpression([t.objectProperty('locator', t.stringLiteral('part1'))])),
        ])
      ),
    ])
  );
});

it('handles closing brackets after comments', () => {
  const tokens: Array<Token> = [
    { type: 'identifier', value: 'modifier' },
    { type: 'assignment', value: '=' },
    { type: 'bracket', value: '{' },
    { type: 'identifier', value: 'ship_shield_regen_add_static' },
    { type: 'assignment', value: '=' },
    { type: 'identifier', value: '@regen_S1' },
    { type: 'comment', value: 'Regeneration per day' },
    { type: 'bracket', value: '}' },
  ];

  const ast = parse(tokens);
  expect(ast).toEqual(
    t.objectExpression([
      t.objectProperty(
        'modifier',
        t.objectExpression([t.objectProperty('ship_shield_regen_add_static', t.stringLiteral('@regen_S1'))])
      ),
    ])
  );
});

it('handles a comment as the final token', () => {
  const tokens: Array<Token> = [
    { type: 'identifier', value: '@regen_S1' },
    { type: 'assignment', value: '=' },
    { type: 'number', value: '1' },
    { type: 'comment', value: 'Regeneration per day' },
  ];

  const ast = parse(tokens);
  expect(ast).toEqual(t.objectExpression([t.objectProperty('@regen_S1', t.numericLiteral(1))]));
});

it('handles comments in arrays', () => {
  const tokens: Array<Token> = [
    { type: 'identifier', value: 'ai_tags' },
    { type: 'assignment', value: '=' },
    { type: 'bracket', value: '{' },
    { type: 'identifier', value: 'weapon_role_anti_shield' },
    { type: 'comment', value: 'This is a comment' },
    { type: 'identifier', value: 'weapon_role_anti_armor' },
    { type: 'bracket', value: '}' },
  ];

  const ast = parse(tokens);
  expect(ast).toEqual(
    t.objectExpression([
      t.objectProperty(
        'ai_tags',
        t.arrayExpression([t.stringLiteral('weapon_role_anti_shield'), t.stringLiteral('weapon_role_anti_armor')])
      ),
    ])
  );
});
