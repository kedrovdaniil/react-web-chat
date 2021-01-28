import React, { useContext } from 'react';
import Portal from './../portal/Portal';
import s from './Modal.module.scss';
import { StoreContext } from './../../store/store';

const Modal = ({ type, title, message, modalAllowForClose }) => {

    const {state, setState} = useContext(StoreContext)

    let modalClass
    switch (type) {
        case 'info': {
            modalClass = s.modalWindow
            break
        }
        case 'warn': {
            modalClass = `${s.modalWindow} ${s.warn}`
            break
        }
        case 'error': {
            modalClass = `${s.modalWindow} ${s.error}`
            break
        }
        default:
            modalClass = s.modalWindow
            break
    }

    const closeHandler = () => {
        setState({...state, isModalOpen: false})
    }

    return (
        <div>
            <Portal>
                <div className={s.overlay}>
                    <div className={modalClass}>
                        <div className={s.head}>
                            <span className={s.title}>{title}</span>
                            <div className={!modalAllowForClose ? s.disabled : s.close }>
                                <span onClick={modalAllowForClose ? closeHandler : null}>&#10006;</span>
                            </div>
                        </div>
                        <div className={s.messageWrapper}><p className={s.message}>{message}</p></div>
                    </div>
                </div>
            </Portal>
        </div>
    );
}

export default Modal;
