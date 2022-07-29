import { useQuery } from 'react-query';

import axios from '../utils/axios';

const getChatById = async (chatId) => {
  try {
    const response = await axios.get(`/api/chat/${chatId}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

const useChat = (chatId) => {
  return useQuery(['chat', chatId], () => getChatById(chatId), {
    refetchOnWindowFocus: true,
  });
};

export default useChat;
