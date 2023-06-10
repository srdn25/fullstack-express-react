import * as React from "react";
import './NotFound.css';

import { Link } from '@mui/material';

export default function NotFound() {
    return (
        <div className="not-found">
            <h2>Nothing to see here!</h2>
            <Link href="/">Go to home page</Link>
        </div>
    );
}