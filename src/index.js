import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ImageViewerController from './screens/ImageViewerController';
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
    <BrowserRouter>
        <ImageViewerController />
    </BrowserRouter>,
    document.getElementById('root')
);