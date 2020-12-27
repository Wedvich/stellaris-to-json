export enum AstNodeType {
  array = 'array',
  boolean = 'boolean',
  endOfFile = 'endOfFile',
  number = 'number',
  object = 'object',
  property = 'property',
  string = 'string',
}

export type AstNode =
  | ArrayExpression
  | BooleanLiteral
  | EndOfFileMarker
  | NumericLiteral
  | ObjectExpression
  | ObjectProperty
  | StringLiteral;

export interface NumericLiteral {
  type: AstNodeType.number;
  value: number;
}

export const numericLiteral = (value: number): NumericLiteral => ({
  type: AstNodeType.number,
  value,
});

export interface StringLiteral {
  type: AstNodeType.string;
  value: string;
}

export const stringLiteral = (value: string): StringLiteral => ({
  type: AstNodeType.string,
  value,
});

export interface BooleanLiteral {
  type: AstNodeType.boolean;
  value: boolean;
}

export const booleanLiteral = (value: boolean): BooleanLiteral => ({
  type: AstNodeType.boolean,
  value,
});

export interface ObjectProperty {
  type: AstNodeType.property;
  id: string;
  value: AstNode;
}

export const objectProperty = (id: string, value: AstNode): ObjectProperty => ({
  type: AstNodeType.property,
  id,
  value,
});

export interface ObjectExpression {
  type: AstNodeType.object;
  properties: Array<ObjectProperty>;
}

export const objectExpression = (properties: Array<ObjectProperty>): ObjectExpression => ({
  type: AstNodeType.object,
  properties,
});

export interface ArrayExpression {
  type: AstNodeType.array;
  elements: Array<AstNode>;
}

export const arrayExpression = (elements: Array<AstNode>): ArrayExpression => ({
  type: AstNodeType.array,
  elements,
});

export interface EndOfFileMarker {
  type: AstNodeType.endOfFile;
}

export const endOfFile = (): EndOfFileMarker => ({ type: AstNodeType.endOfFile });
