import { useContext, useEffect, useState } from 'react';
import { ChatsAPI, usersAPI } from '../../../../api/api';
import { StoreContext } from '../../../../contexts/StoreProvider';
import PlusSVG from '../../../icons/PlusSVG';
import Modal from '../../../modal/Modal';
import SelectableUser from '../../rooms/addRoom/selectableUser/SelectableUser';
import s from './EditButton.module.scss';
import Member from './member/Member';


const AddMemberModal = ({
    currentMembers,
    onCancel,
    chatId
}) => {

    // state
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState(currentMembers)
    const [isSearchLoading, setIsSearchLoading] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    // selected user
    const isSelected = (userId) => selectedUsers.find(u => u?.id === userId) ? true : false

    // select handler
    const onSelectHandler = (e) => {
        const isAlreadySelected = selectedUsers.find(u => u.id === Number(e.target.value))
        if (isAlreadySelected) {
            setSelectedUsers(selectedUsers => [...selectedUsers.filter(u => u.id !== Number(e.target.value))])
        } else {
            setSelectedUsers(selectedUsers => [...selectedUsers, searchResults.find(u => u.id === Number(e.target.value))])
        }
    }

    // filter
    const filterAddedUsers = (user) => {
        let notInclude = true
        for (let i = 0; i < currentMembers.length; i++) {
            if (currentMembers[i].id === user.id) {
                notInclude = false
            }
        }
        return notInclude
    }

    // search
    const onChangeSearch = async (e) => {
        // set input value
        setSearch(e.target.value)
        setIsSearchLoading(true)

        // get search results
        const results = await usersAPI.findUsers(e.target.value)
        console.log('RESULTS', results)
        console.log('currentMembers', currentMembers)

        // set result
        const filteredResults = results.filter(user => { console.log('FILTER: USER = ', user, '|', currentMembers.includes(user)); return filterAddedUsers(user) })
        setSearchResults(filteredResults)
        setIsSearchLoading(false)
    }

    // init
    useEffect(() => {
        setIsSearchLoading(true)
        const init = async () => {
            const r = await usersAPI.findUsers("")
            const filteredResutls = r.filter(user => { console.log('FILTER: USER = ', user, '|', currentMembers.includes(user)); return filterAddedUsers(user) })
            setSearchResults(filteredResutls)
            setIsSearchLoading(false)
        }
        init()
    }, []);

    // submit
    const onSubmit = async () => {
        setIsLoading(true)
        const results = selectedUsers.map(user => ChatsAPI.addMember(chatId, user.id))
        const r = await Promise.all(results)
        if (r) {
            onCancel()
            setIsLoading(false)
            window.location.reload()
        }
    }

    return <div className={s.addMemberModal}>
        <input type="search" name="search" value={search} onChange={onChangeSearch} placeholder="Search" className={s.input} />
        {!isSearchLoading ?
            <div className={s.users}>
                {searchResults.map(user => <SelectableUser
                    id={user.id}
                    name={user.name}
                    avatarUrl={user.avatar_url}
                    email={user.email}
                    onSelect={onSelectHandler}
                    isSelected={isSelected(user.id)}
                    key={user.id}
                />)}</div> :
            <div className={s.loader}><img src={'/loader.gif'} /></div>
        }
        <div className={s.buttons}>
            <button onClick={onCancel} className={s.cancel}>Cancel</button>
            <button onClick={onSubmit} className={s.add} disabled={!selectedUsers.length && !isLoading}>Add users</button>
        </div>
    </div>
}

const EditModal = ({
    isAdmin,
    isManager,
    adminUser,
    managerUser,
    chatName,
    members,
    deleteMember,
    closeModal,
    editChat,
    chatId
}) => {

    // state
    const [chatNameValue, setChatNameValue] = useState(chatName)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // modal
    const openAddMemberModal = () => setIsModalOpen(true)
    const closeAddMemberModal = () => setIsModalOpen(false)

    return <div className={s.modal}>
        <div className={s.name}>
            <hr />
            <h2>Chat name</h2>
            <input type="text" name="name" value={chatNameValue} onChange={(e) => setChatNameValue(e.target.value)} className={s.input} placeholder="Enter the chat name" />
        </div>
        <div className={s.membersWrapper}>
            <hr />
            <h2>Members</h2>
            <div className={s.members}>
            {members.map(user => <Member
                id={user.id}
                imageUrl={user.avatar_url}
                name={user.name}
                email={user.email}
                isDeleteAvailable={isAdmin}
                onDelete={deleteMember}
                isAdmin={isAdmin}
                isManager={isManager}
                adminUser={adminUser}
                managerUser={managerUser}
                key={user.id}
            />)}
            </div>
            <button onClick={openAddMemberModal} className={s.addButton}>
                <PlusSVG />
                Add a new one
            </button>
            {isModalOpen && <Modal title="Add a new member" modalAllowForClose={true} onClose={closeAddMemberModal}>
                <AddMemberModal currentMembers={members} onCancel={closeAddMemberModal} chatId={chatId} />
            </Modal>}
            <hr />
        </div>
        <div className={s.buttons}>
            <button onClick={closeModal} className={s.cancel}>Cancel</button>
            <button onClick={() => editChat(chatNameValue)} className={s.save}>Save</button>
        </div>
    </div>
}

const EditButton = ({ isAdmin, isManager, chatId, chatName, members, adminUser, managerUser }) => {

    // context
    // const { state, setState } = useContext(StoreContext)

    // state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [membersList, setMembersList] = useState(members)

    // open modal
    const openModal = () => setIsModalOpen(true)

    // cancel
    const closeModal = () => setIsModalOpen(false)

    // edit chat
    const editChat = async (name) => {
        const r = await ChatsAPI.edit(chatId, name)
        if (r.result) {
            closeModal()
            window.location.reload()
        }
    }

    // delete member handler
    const deleteMember = async (userId) => {
        setMembersList(members => members.filter(m => m.id !== userId))
        const r = await ChatsAPI.removeMember(chatId, userId)
    }

    // const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className={s.wrapper}>
            <button onClick={openModal} className={s.button}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 348.9 348.9"><path d="M334 11.8l-.4-.4a43.4 43.4 0 00-61.4 2.8l-155.4 170a15 15 0 00-3.2 5.4l-18.2 54.8a20.8 20.8 0 0019.7 27.4c2.9 0 5.7-.6 8.4-1.8l52.9-23.1c1.9-.9 3.6-2.1 5-3.6L336.8 73.2a43.5 43.5 0 00-2.8-61.4zM130.4 234.2l10.7-32 .9-1 20.3 18.5-.9 1-31 13.5zM314.6 53l-132 144.6-20.4-18.5L294.3 34.4a13.4 13.4 0 0119-.9l.5.4c5.4 5 5.8 13.6.8 19z" /><path d="M303.9 138.4a15 15 0 00-15 15v127.3c0 21-17.2 38.2-38.2 38.2H68.9c-21 0-38.1-17.1-38.1-38.2V100.4c0-21 17-38.1 38.1-38.1h131.6a15 15 0 000-30H68.9A68.2 68.2 0 00.8 100.4v180.3A68.2 68.2 0 0068.9 349h181.8a68.2 68.2 0 0068.1-68.2V153.4a15 15 0 00-15-15z" /></svg>
            </button>
            {isModalOpen && <Modal title="Edit chat" modalAllowForClose={true} type="info" onClose={closeModal}>
                <EditModal
                    chatName={chatName}
                    members={membersList}
                    deleteMember={deleteMember}
                    closeModal={closeModal}
                    editChat={editChat}
                    isAdmin={isAdmin}
                    isManager={isManager}
                    adminUser={adminUser}
                    managerUser={managerUser}
                    chatId={chatId}
                />
            </Modal>}
        </div>
    );
}

export default EditButton;
