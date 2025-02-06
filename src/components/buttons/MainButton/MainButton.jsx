import './MainButton.css'

export default function MainButton({text, onClick, type}) {
        return (
            <button onClick={onClick} className="button" type={type}> {text}</button>
        )
}