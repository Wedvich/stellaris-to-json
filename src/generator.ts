import * as t from './types';

const _generate = (node: t.AstNode): number | boolean | string => {
  switch (node.type) {
    case t.AstNodeType.object:
      return `{${node.properties.map(_generate).join(',')}}`;

    case t.AstNodeType.property:
      return `"${node.id}":${_generate(node.value)}`;

    case t.AstNodeType.boolean:
    case t.AstNodeType.number:
      return node.value;

    case t.AstNodeType.string:
      return `"${node.value}"`;

    case t.AstNodeType.array:
      return `[${node.elements.map(_generate).join(',')}]`;

    default:
      return '';
  }
};

export const generate = _generate as (root: t.AstNode) => string;
