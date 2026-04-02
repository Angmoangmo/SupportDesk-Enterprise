import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const getConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const getTickets = async (token) => {
  const response = await axios.get(`${API_URL}/tickets`, getConfig(token));
  return response.data;
};

const getTicket = async (ticketId, token) => {
  const response = await axios.get(`${API_URL}/tickets/${ticketId}`, getConfig(token));
  return response.data;
};

const createTicket = async (ticketData, token) => {
  const response = await axios.post(`${API_URL}/tickets`, ticketData, getConfig(token));
  return response.data;
};

/* ✅ VERY IMPORTANT — generic updater */
const updateTicket = async (ticketId, updates, token) => {
  const response = await axios.put(
    `${API_URL}/tickets/${ticketId}`,
    updates,
    getConfig(token)
  );
  return response.data;
};

const getTicketStats = async (token) => {
  const response = await axios.get(`${API_URL}/tickets/stats`, getConfig(token));
  return response.data;
};

const ticketService = {
  getTickets,
  getTicket,
  createTicket,
  updateTicket,   // ✅ matches your slice
  getTicketStats,
};

export default ticketService;