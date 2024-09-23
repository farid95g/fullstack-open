import { createContext, useContext, useReducer } from "react";

const notificationReducer = (state, action) => {
	switch (action.type) {
		case 'VOTE':
			return `anecdote "${action.payload}" voted`
		case 'CREATE':
			return `anecdote "${action.payload}" created`
		case 'ERROR':
			return action.payload
		case 'CLEAR':
			return ''
		default:
			return state
	}
}

const NotificationContext = createContext(null)

export const NotificationContextProvider = ({ children }) => {
	const [notification, setNotification] = useReducer(notificationReducer, '')

	return (
		<NotificationContext.Provider
			value={{ notification, setNotification }}
		>
			{children}
		</NotificationContext.Provider>
	)
}

export default NotificationContext