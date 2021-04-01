import { useContext } from 'react';
import { StoreContext } from '../../../../../contexts/StoreProvider';
import PlusSVG from '../../../../icons/PlusSVG';
import s from './Member.module.scss';

const Member = ({ id, imageUrl, name, email, isDeleteAvailable, onDelete, isAdmin, isManager, adminUser, managerUser }) => {

    // context
    const {state} = useContext(StoreContext)

    const userId = state.user_id

    return (
        <div className={s.wrapper}>
            <div className={s.infoWrapper}>
                <div className={s.image}>
                    <img src={imageUrl} alt={name} />
                </div>
                <div className={s.info}>
                    <span className={s.name}>{name}</span>
                    <span>{email}</span>
                    <div className={s.tags}>
                        {adminUser && adminUser.id === id && <span className={s.tag}>admin</span>}
                        {managerUser && managerUser.id === id && <span className={s.tag}>manager</span>}
                    </div>
                </div>
            </div>
            <div className={s.control}>
                {onDelete && isDeleteAvailable && <button onClick={() => onDelete(id)} className={s.delete}>
                    <PlusSVG />
                </button>}
            </div>
        </div>
    );
}

export default Member;
