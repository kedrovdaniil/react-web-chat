import s from './SelectableUser.module.scss';

const SelectableUser = ({ id, avatarUrl, name, email, onSelect, isSelected }) => {
    return (
        <div className={s.wrapper}>
            <div className={s.user}>
                <div className={s.image}>
                    <img src={avatarUrl} alt={name} />
                </div>
                <div className={s.info}>
                    <span className={s.name}>{name}</span>
                    <span className={s.email}>{email}</span>
                </div>
            </div>
            <input type="checkbox" name="user" id="user" value={id} className={s.checkbox} onChange={onSelect} checked={isSelected} />
        </div>
    );
}

export default SelectableUser;
