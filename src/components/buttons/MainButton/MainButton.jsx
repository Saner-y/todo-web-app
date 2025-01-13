import './MainButton.css'

export default function MainButton({text, onClick}) {
        return (
            <button onClick={onClick} className="button">{text}</button>
        )
}