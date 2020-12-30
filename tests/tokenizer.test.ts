import { tokenize } from '../src/tokenizer';

it('throws a TypeError when it encounters an unrecognized character', () => {
  const fixture = `
    ! = yes
  `;

  expect(() => tokenize(fixture)).toThrow({
    message: 'Unexpected character: !',
    name: TypeError.name,
  });
});

it('handles boolean values', () => {
  const fixture = `
    @value = yes
    @value = no
  `;

  const tokens = tokenize(fixture);

  expect(tokens).toEqual([
    { type: 'identifier', value: '@value' },
    { type: 'assignment', value: '=' },
    { type: 'boolean', value: 'yes' },
    { type: 'identifier', value: '@value' },
    { type: 'assignment', value: '=' },
    { type: 'boolean', value: 'no' },
  ]);
});

it('handles variables with mixed letters and numbers', () => {
  const fixture = `
    alloys = @s_t3_upkeep_alloys
  `;

  const tokens = tokenize(fixture);

  expect(tokens).toEqual([
    { type: 'identifier', value: 'alloys' },
    { type: 'assignment', value: '=' },
    { type: 'identifier', value: '@s_t3_upkeep_alloys' },
  ]);
});

it('handles keys with special symbols', () => {
  const fixture = `
    achievement_l-cluster = {}
  `;

  const tokens = tokenize(fixture);

  expect(tokens).toEqual([
    { type: 'identifier', value: 'achievement_l-cluster' },
    { type: 'assignment', value: '=' },
    { type: 'bracket', value: '{' },
    { type: 'bracket', value: '}' },
  ]);
});

it('handles the greater-than operator', () => {
  const fixture = `
    fleet_size > 119
  `;

  const tokens = tokenize(fixture);

  expect(tokens).toEqual([
    { type: 'identifier', value: 'fleet_size' },
    { type: 'comparison', value: '>' },
    { type: 'number', value: '119' },
  ]);
});

it('handles the greater-than-or-equal operator', () => {
  const fixture = `
    fleet_size >= 119
  `;

  const tokens = tokenize(fixture);

  expect(tokens).toEqual([
    { type: 'identifier', value: 'fleet_size' },
    { type: 'comparison', value: '>=' },
    { type: 'number', value: '119' },
  ]);
});

it('handles the less-than operator', () => {
  const fixture = `
    fleet_size < 119
  `;

  const tokens = tokenize(fixture);

  expect(tokens).toEqual([
    { type: 'identifier', value: 'fleet_size' },
    { type: 'comparison', value: '<' },
    { type: 'number', value: '119' },
  ]);
});

it('handles the less-than-or-equal operator', () => {
  const fixture = `
    fleet_size <= 119
  `;

  const tokens = tokenize(fixture);

  expect(tokens).toEqual([
    { type: 'identifier', value: 'fleet_size' },
    { type: 'comparison', value: '<=' },
    { type: 'number', value: '119' },
  ]);
});

it('supports identifiers that begin with numbers', () => {
  const fixture = `
    has_country_flag = 10yr_patronage
  `;

  const tokens = tokenize(fixture);

  expect(tokens).toEqual([
    { type: 'identifier', value: 'has_country_flag' },
    { type: 'assignment', value: '=' },
    { type: 'identifier', value: '10yr_patronage' },
  ]);
});

it('supports fractional numbers', () => {
  const fixture = `
    weight = 0.9
  `;

  const tokens = tokenize(fixture);

  expect(tokens).toEqual([
    { type: 'identifier', value: 'weight' },
    { type: 'assignment', value: '=' },
    { type: 'number', value: '0.9' },
  ]);
});

it('supports negative whole numbers', () => {
  const fixture = `
    ship_evasion_mult = -1
  `;

  const tokens = tokenize(fixture);

  expect(tokens).toEqual([
    { type: 'identifier', value: 'ship_evasion_mult' },
    { type: 'assignment', value: '=' },
    { type: 'number', value: '-1' },
  ]);
});

it('supports negative fractional numbers', () => {
  const fixture = `
    ships_upkeep_mult = -0.25
  `;

  const tokens = tokenize(fixture);

  expect(tokens).toEqual([
    { type: 'identifier', value: 'ships_upkeep_mult' },
    { type: 'assignment', value: '=' },
    { type: 'number', value: '-0.25' },
  ]);
});

it('supports end-of-file comments', () => {
  const fixture = '#}';

  const tokens = tokenize(fixture);

  expect(tokens).toEqual([{ type: 'comment', value: '}' }]);
});
