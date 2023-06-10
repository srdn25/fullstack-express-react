import { JSONSchemaType } from 'ajv';
import { ITaskBase } from '../../redux/reducer/task';

const schema: JSONSchemaType<ITaskBase> = {
    type: 'object',
    properties: {
        title: {
            type: 'string',
            pattern: '^(\\w|\\s){3,150}$',
            nullable: false,
        },
        status: {
            type: 'string',
            pattern: '^[a-z_]{3,25}$',
            nullable: true,
        },
        author: {
            type: 'string',
            pattern: '^(\\w|\\s){2,15}$',
            nullable: false,
        },
        dueDate: {
            type: 'string',
            // time should be in UTC
            // pattern: '^[0-9]{4}-[0-9]{2}-[0-9]{2}\\w[0-9]{2}:[0-9]{2}$',
            nullable: false,
        },
        description: {
            type: 'string',
            pattern: '^(\\w|\\s|,|.|!|\\?|\\)|\\(|-){2,150}$',
            nullable: true,
        }
    },
    required: [ 'title', 'dueDate', 'author' ],
    additionalProperties: false,
}

export default schema;