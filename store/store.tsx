import { configureStore, createSlice } from "@reduxjs/toolkit";


const slice = createSlice({
    name:"music",
    initialState: {
        music:{
            name:"",
            album:"",
            file:"",
        },
    },
    reducers: {
        playMusic:(state, action) => {
            state.music = action.payload;
        }
    }
})

const store = configureStore(slice);

export {store, slice};