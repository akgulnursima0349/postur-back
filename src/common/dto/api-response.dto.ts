import { ApiProperty } from '@nestjs/swagger';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

/**
 * Tüm API response'ları bu wrapper içinde döner:
 * { "success": true, "data": <payload> }
 */
export function apiSuccessSchema(
  dataSchema: SchemaObject | { $ref: string },
): SchemaObject {
  return {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: dataSchema as SchemaObject,
    },
    required: ['success', 'data'],
  };
}

export function apiSuccessArraySchema(
  itemSchema: SchemaObject | { $ref: string },
): SchemaObject {
  return {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: {
        type: 'array',
        items: itemSchema as SchemaObject,
      },
    },
    required: ['success', 'data'],
  };
}
