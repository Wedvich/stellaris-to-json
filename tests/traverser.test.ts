import * as t from '../src/types';
import { traverse, Visitor } from '../src/traverser';

it('calls the visit method', () => {
  const visitor: Visitor = {
    object: jest.fn(),
  };

  const ast = t.objectExpression([]);

  traverse(ast, visitor);

  expect(visitor.object).toHaveBeenCalledTimes(1);
});
