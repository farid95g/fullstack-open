const Notification = ({ info }) => {
    const messageStyles = {
        border: '2px solid',
        borderColor: info?.status === 'success' ? 'green' : 'red',
        backgroundColor: 'lightgray',
        color: info?.status === 'success' ? 'green' : 'red',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10
    }

    return info === null 
        ? null 
        : <div style={messageStyles}>
            {info.message}
        </div>
}

export default Notification