import { useContext, useState } from 'react';
import { ChatsAPI } from '../../../../api/api';
import { StoreContext } from '../../../../contexts/StoreProvider';
import Modal from '../../../modal/Modal';
import s from './DeleteButton.module.scss';


const DeleteModal = ({ closeModal, deleteChat }) => {
    return <div className={s.deleteModal}>
        <p>Do you want to delete this chat?</p>
        <div className={s.buttons}>
            <button onClick={closeModal} className={s.cancel}>Cancel</button>
            <button onClick={deleteChat} className={s.delete}>Delete</button>
        </div>
    </div>
}

const DeleteButton = ({ chatId }) => {

    // context
    const { state, setState } = useContext(StoreContext)

    // state
    const [isModalOpen, setIsModalOpen] = useState(false)

    // open modal
    const openModal = () => setIsModalOpen(true)

    // cancel
    const closeModal = () => setIsModalOpen(false)

    // delete
    const deleteChat = async () => {
        const r = await ChatsAPI.delete(chatId)
        if (r.result) {
            closeModal()
            window.location.reload()
        }
    }

    return (
        <div className={s.wrapper}>
            <button onClick={openModal}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M424 64h-88V48c0-26-22-48-48-48h-64c-26 0-48 22-48 48v16H88c-22 0-40 18-40 40v56c0 9 7 16 16 16h9l14 290c1 26 22 46 48 46h242c26 0 47-20 48-46l14-290h9c9 0 16-7 16-16v-56c0-22-18-40-40-40zM208 48c0-9 7-16 16-16h64c9 0 16 7 16 16v16h-96zM80 104c0-4 4-8 8-8h336c4 0 8 4 8 8v40H80zm313 361c0 8-7 15-16 15H135c-9 0-16-7-16-15l-14-289h302z" /><path d="M256 448c9 0 16-7 16-16V224a16 16 0 00-32 0v208c0 9 7 16 16 16zM336 448c9 0 16-7 16-16V224a16 16 0 00-32 0v208c0 9 7 16 16 16zM176 448c9 0 16-7 16-16V224a16 16 0 00-32 0v208c0 9 7 16 16 16z" /></svg>
            </button>
            {isModalOpen && <Modal title="Delete chat" modalAllowForClose={true} onClose={closeModal} type="info">
                <DeleteModal closeModal={closeModal} deleteChat={deleteChat} />
            </Modal>}
        </div>
    );
}

export default DeleteButton;
