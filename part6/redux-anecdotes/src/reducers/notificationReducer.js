import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
	name: 'notification',
	initialState: '',
	reducers: {
		addNotification(state, action) {
			return action.payload
		},
		clearNotification(state, action) {
			return ''
		}
	}
})

export const { addNotification, clearNotification } = notificationSlice.actions

export const setNotification = (notification, delay) => {
	return async dispatch => {
		dispatch(addNotification(notification))
		setTimeout(() => {
			dispatch(clearNotification())
		}, delay * 1000)
	}
}

export default notificationSlice.reducer
