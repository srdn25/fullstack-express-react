import React, { useEffect, useState } from 'react';
import { Moment } from 'moment/moment';

import { Button } from '@mui/material';

import TaskDetails from '../TaskDetails/TaskDetails';
import { taskValidate } from '../../validation';
import { TASK_DEFAULT_STATUSES } from '../../utils/consts';
import { prepareDate } from '../../utils/lib';
import moment from 'moment-timezone';

function CreateTask (): React.ReactElement {
    const [status, setStatus] = useState<string>(TASK_DEFAULT_STATUSES.todo);
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [author, setAuthor] = useState<string>('');
    const [dueDate, setDueDate] = useState<string|Moment>(moment());

    const [validateErrors, setValidateErrors] = useState<object|null>({ error: 1 });

    useEffect(() => {
        const task = {
            title,
            author,
            description,
            status,
            dueDate,
        };

        const isValid = taskValidate(task);

        if (isValid) {
            setValidateErrors(null);
        } else {
            setValidateErrors(taskValidate.errors || null);
        }

        return (() => {
            setValidateErrors({ error: 1 });
        });
    }, [
        status,
        title,
        description,
        author,
        dueDate,
    ]);

    function handleClearForm () {
        setAuthor('');
        setTitle('');
        setDescription('');
        setStatus('');
        setDueDate(moment());
    }

    function updateDueDate (date: Moment) {
        const preparedDate = prepareDate(date);
        debugger
        setDueDate(preparedDate);
    }
    function handleSaveTask () {
        // todo: call action for send webhook request to server with new data
        alert('save...');
    }

    return (
        <div className='create-task'>
            <TaskDetails
                title={title}
                updateTitle={setTitle}
                author={author}
                updateAuthor={setAuthor}
                description={description}
                updateDescription={setDescription}
                dueDate={dueDate}
                updateDueDate={updateDueDate}
                status={status}
                updateStatus={setStatus}
            />

            <Button
                variant="outlined"
                color="error"
                onClick={handleClearForm}
            >
                Clear form
            </Button>
            <Button
                disabled={!!validateErrors}
                variant="contained"
                color="success"
                onClick={handleSaveTask}
            >
                Save
            </Button>
        </div>
    )
}

export default CreateTask;