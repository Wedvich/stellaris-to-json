import * as t from './types';
import { traverse } from './traverser';

const wrapKeyword = (id: string) => id.replace(/^(constructor)$/, '%%__$1__%%');
const unwrapKeyword = (id: string) => id.replace(/^%%__(.*)__%%$/, '$1');

// TODO: Don't mutate?
export const transform = (root: t.AstNode): void => {
  traverse(root, {
    object: (node: t.AstNode) => {
      const objectNode = node as t.ObjectExpression;
      const { properties } = objectNode;
      const duplicateProperties = properties.reduce((groups, property) => {
        const propertyId = wrapKeyword(property.id);
        groups[propertyId] = (groups[propertyId] ?? []).concat(property);
        return groups;
      }, {} as Record<string, Array<t.ObjectProperty>>);

      const duplicatePropertyIds = Object.keys(duplicateProperties).filter(id => duplicateProperties[id].length > 1);
      const dedupedProperties = duplicatePropertyIds.map(id =>
        t.objectProperty(unwrapKeyword(id), t.arrayExpression(duplicateProperties[id].map(p => p.value)))
      );

      if (!dedupedProperties.length) return;

      const mergedProperties = properties
        .filter(property => !duplicatePropertyIds.includes(wrapKeyword(property.id)))
        .concat(dedupedProperties);

      objectNode.properties = mergedProperties;
    },
  });
};
