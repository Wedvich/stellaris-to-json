import * as t from './types';

export type Visitor = Partial<Record<t.AstNodeType, (node: t.AstNode, parent?: t.AstNode) => void>>;

export const traverse = (root: t.AstNode, visitor: Visitor): void => {
  const traverseArray = (nodes: Array<t.AstNode>, parent?: t.AstNode) => {
    nodes.forEach(child => {
      traverseNode(child, parent);
    });
  };

  const traverseNode = (node: t.AstNode, parent?: t.AstNode) => {
    visitor[node.type]?.(node, parent);
    switch (node.type) {
      case t.AstNodeType.array:
        traverseArray(node.elements, node);
        break;

      case t.AstNodeType.object:
        traverseArray(node.properties, node);
        break;

      case t.AstNodeType.property:
        traverseNode(node.value, node);
        break;

      case t.AstNodeType.boolean:
      case t.AstNodeType.number:
      case t.AstNodeType.string:
        break;
    }
  };

  traverseNode(root);
};
