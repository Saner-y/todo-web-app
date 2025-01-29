import './SearchBar.css'
import IconButton from "../../buttons/IconButton/IconButton.jsx";
import searchIcon from '../../../assets/search-react.svg'

export default function SearchBar({placeholder, onChange, value, onClick}) {
    return (
        <div className="search-bar">
            <input value={value} onChange={onChange} placeholder={placeholder} className='search-input' type="text"/>
            <IconButton icon={searchIcon} alt="search-icon" onClick={onClick}/>
        </div>
    )
}
