import Ajv from 'ajv';

import taskSchema from './schema/task';

const taskAjv = new Ajv();
export const taskValidate = taskAjv.compile(taskSchema);
