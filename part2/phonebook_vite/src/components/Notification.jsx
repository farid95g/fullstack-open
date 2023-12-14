const Notification = ({ message, status }) => {
    if (!message) return null

    return <div className={`notification ${status}`}>{message}</div>
}

export default Notification
