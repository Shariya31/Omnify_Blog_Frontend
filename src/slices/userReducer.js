import { createSlice } from "@reduxjs/toolkit";

const userData = JSON.parse(localStorage.getItem('userData')) || { user: null, token: null };

const initialState = {
    user: userData.user || null,
    loading: true,
    role: userData.user?.role || "user", 
    token: userData.token || null 
};

export const userSlice = createSlice({
    name: 'userReducer',
    initialState,
    reducers: {
        userExist: (state, action) => {
            console.log(action.payload);
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.user.role; // Ensure payload has user.role
        },
        userNotExist: (state) => {
            state.loading = false;
            state.user = null;
            state.token = null;
            state.role = null;
            localStorage.removeItem("userData")
        }
    }
});

export const { userExist, userNotExist } = userSlice.actions;
export default userSlice.reducer;