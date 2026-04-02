import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const getNotes = async (ticketId, token) => {
  const response = await axios.get(
    `${API_URL}/tickets/${ticketId}/notes`,
    getConfig(token)
  );
  return response.data;
};

const addNote = async (ticketId, noteData, token) => {
  const response = await axios.post(
    `${API_URL}/tickets/${ticketId}/notes`,
    noteData,
    getConfig(token)
  );
  return response.data;
};

const noteService = { getNotes, addNote };
export default noteService;