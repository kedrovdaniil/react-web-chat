import { useEffect, useState } from 'react';
import { ChatsAPI, usersAPI } from '../../../../api/api';
import PlusSVG from '../../../icons/PlusSVG';
import Loader from '../../../loader/Loader';
import s from './AddRoom.module.scss';
import SelectableUser from './selectableUser/SelectableUser';

const AddRoom = ({ openCloseForm }) => {

    // state
    const [chatName, setChatName] = useState("")
    const [chatSearch, setChatSearch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    const [isSearchLoading, setIsSearchLoading] = useState(false)
    const [selectedUsers, setSelectedUsers] = useState([])

    // init
    useEffect(() => {
        setIsSearchLoading(true)
        const init = async () => {
            const r = await usersAPI.findUsers("")
            setSearchResults(r)
            setIsSearchLoading(false)
        }
        init()
    }, []);

    // search
    const onChangeSearch = async (e) => {
        // set input value
        setChatSearch(e.target.value)
        setIsSearchLoading(true)

        // get search results
        const results = await usersAPI.findUsers(e.target.value)

        // set result
        setSearchResults(results)
        setIsSearchLoading(false)
    }

    // select handler
    const onSelectHandler = (e) => {
        const isAlreadySelected = selectedUsers.find(u => u.id === Number(e.target.value))
        if (isAlreadySelected) {
            setSelectedUsers(selectedUsers => [...selectedUsers.filter(u => u.id !== Number(e.target.value))])
        } else {
            setSelectedUsers(selectedUsers => [...selectedUsers, searchResults.find(u => u.id === Number(e.target.value))])
        }
    }

    // submit handler
    const submitHandler = async (e) => {
        e.preventDefault()
        const r = await ChatsAPI.create(chatName, selectedUsers)
        if (r.result = true) {
            window.location.reload();
        } else {

        }
    }

    // selected user
    const isSelected = (userId) => selectedUsers.find(u => u?.id === userId) ? true : false

    return (
        <div className={s.wrapper}>
            <div className={s.close} onClick={openCloseForm}>
                <PlusSVG />
            </div>
            <form onSubmit={submitHandler}>
                <input name="name" type="search" value={chatName} onChange={(e) => setChatName(e.target.value)} className={s.input} placeholder={"Enter the chat name"} />
                <input name="search" type="search" value={chatSearch} onChange={onChangeSearch} className={s.input} placeholder={"Search users for add"} />
                <div>
                    <span className={s.count}>Selected users count: {selectedUsers.length}</span>
                </div>
                <hr />
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
                <button type="submit" className={s.button} disabled={!selectedUsers.length}>Create chat</button>
            </form>
        </div>

    );
}

export default AddRoom;
