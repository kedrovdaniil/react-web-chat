import React from 'react';
import ReactDOM from 'react-dom';

const Portal = ({children}) => {
    return ReactDOM.createPortal(
        children,
        document.getElementById('modal')
    );
}

export default Portal;
