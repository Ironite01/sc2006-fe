import './SubmitButton.css';

export default function SubmitButton({ loading, children, className = '', ...props }) {
    return (
        <button
            {...props}
            disabled={loading || props.disabled}
            className={`submit-button transition ${className}`}
        >
            {loading ? <span className="spinner"></span> : children}
        </button>
    );
}