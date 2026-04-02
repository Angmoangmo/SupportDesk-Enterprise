import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import noteService from './noteService';

const initialState = {
    notes: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

// Get notes for a ticket
export const getNotes = createAsyncThunk('notes/getAll', async (ticketId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await noteService.getNotes(ticketId, token);
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Add a note to a ticket
export const addNote = createAsyncThunk('notes/add', async ({ noteText, ticketId }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await noteService.addNote(ticketId, { text: noteText }, token);
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const noteSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        reset: () => initialState,
        noteAdded: (state, action) => {
            // Prevent duplicates (in case the HTTP request also resolved)
            const exists = state.notes.find(n => n._id === action.payload._id);
            if (!exists) {
                state.notes.push(action.payload);
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getNotes.pending, (state) => { state.isLoading = true; })
            .addCase(getNotes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.notes = action.payload;
            })
            .addCase(getNotes.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(addNote.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                
                // Prevent duplicate notes: Redux HTTP vs Socket.io race condition
                const exists = state.notes.find(n => n._id === action.payload._id);
                if (!exists) {
                    state.notes.push(action.payload);
                }
            });
    },
});

export const { reset, noteAdded } = noteSlice.actions;
export default noteSlice.reducer;
