import s from './Loader.module.scss'
import React from 'react';

const Loader = () => {
    return (
        <div className={s.loader}>
            <img src={'https://media.giphy.com/media/3y0oCOkdKKRi0/giphy.gif'} />
        </div>
    );
}

export default Loader;
