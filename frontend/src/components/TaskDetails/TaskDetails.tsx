import React from 'react';
import moment, { Moment } from 'moment';

import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { TASK_DEFAULT_STATUSES_READABLE } from '../../utils/consts';

interface IProps {
    title: string;
    updateTitle(t: string): void;
    author: string;
    updateAuthor(a: string): void;
    dueDate: string|Moment|null;
    updateDueDate(d: string|Moment|null): void;
    status: string;
    updateStatus(s: string): void;
    description: string;
    updateDescription(d: string): void;
}
function TaskDetails (props: IProps): React.ReactElement {
    function handleFieldUpdate<Type>(data: Type, updater: (p: Type) => void) {
        updater(data);
    }

    return (
        <div className='task-details'>
            <TextField
                fullWidth
                required
                id="modal-task-title"
                label="Title"
                value={props.title}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleFieldUpdate(event.target.value as string, props.updateTitle);
                }}
            />
            <Stack
                className='task-modal-line'
                direction={{ sm: 'column', md: 'row' }}
                spacing={{ xs: 1, sm: 2, md: 4 }}
            >
                <TextField
                    required
                    id="modal-task-author"
                    label="Author"
                    value={props.author}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        handleFieldUpdate(event.target.value as string, props.updateAuthor);
                    }}
                />
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DateTimePicker
                        label="Due Date"
                        ampm={false}
                        value={moment(props.dueDate)}
                        onChange={(date) => {
                            handleFieldUpdate(date, props.updateDueDate);
                        }}
                    />
                </LocalizationProvider>
                <FormControl>
                    <InputLabel>Status</InputLabel>
                    <Select
                        labelId="task-status"
                        id="task-modal-status"
                        value={props.status}
                        label="Status"
                        onChange={(event: SelectChangeEvent) => {
                            handleFieldUpdate(event.target.value, props.updateStatus);
                        }}>
                        {Object.entries(TASK_DEFAULT_STATUSES_READABLE).map(([key, value], idx) => (
                            <MenuItem className={`dropdown-status-${key}`} key={idx} value={`${key}`}>{value}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>
            <TextField
                fullWidth
                multiline
                rows={5}
                id="modal-task-description"
                label="Description"
                value={props.description}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    handleFieldUpdate(event.target.value as string, props.updateDescription);
                }}
            />
        </div>
    );
}

export default TaskDetails;