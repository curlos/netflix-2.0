import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    hoveredMovie: null
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.user = null
    },
    hoverOverMovie: (state, action) => {
      state.hoveredMovie = action.payload
    }
  }
})

export const { login, logout, hoverOverMovie } = userSlice.actions

export const selectUser = (state) => state.user.user
export const selectHoveredMovie = (state) => state.user.hoveredMovie

export default userSlice.reducer