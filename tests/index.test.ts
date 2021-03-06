import fs from 'fs';
import path from 'path';

import { convert } from '../src';

it('correctly converts an object data file into JSON', async () => {
  const fixture = await fs.promises.readFile(path.join(__dirname, './fixtures/00_required_sets.txt'), 'utf8');
  const jsonFixture = await fs.promises.readFile(path.join(__dirname, './fixtures/00_required_sets.json'), 'utf8');
  const expected = JSON.parse(jsonFixture);

  const converted = convert(fixture);
  const actual = JSON.parse(converted);

  expect(actual).toEqual(expected);
});

it('correctly converts an array data file into JSON', async () => {
  const fixture = await fs.promises.readFile(path.join(__dirname, './fixtures/00_tags.txt'), 'utf8');
  const jsonFixture = await fs.promises.readFile(path.join(__dirname, './fixtures/00_tags.json'), 'utf8');
  const expected = JSON.parse(jsonFixture);

  const converted = convert(fixture);
  const actual = JSON.parse(converted);

  expect(actual).toEqual(expected);
});

it('returns an empty object if an empty string is passed', () => {
  const empty = convert('');
  expect(empty).toEqual('{}');
});

it('returns an empty object if undefined is passed', () => {
  const empty = convert(undefined as string);
  expect(empty).toEqual('{}');
});

it('returns an empty object if null is passed', () => {
  const empty = convert(null as string);
  expect(empty).toEqual('{}');
});
