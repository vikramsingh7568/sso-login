import instance from "./axios";

// 1️⃣ Get All Users
export const getAllUsers = async () => {
  try {
    const res = await instance.get('/admin/get/all/users'); // 🔁 Replace with actual endpoint
    return res.data;
  } catch (err) {
    console.error('User fetch error:', err.response?.data || err.message);
    throw err;
  }
};

// 2️⃣ Get Chat List by User ID
export const getChatsByUserId = async (userId) => {
  try {
    const res = await instance.get(`/admin/user/${userId}/chats`); // Replace with actual endpoint
    return res.data;
  } catch (err) {
    console.error('Chat fetch error:', err.response?.data || err.message);
    throw err;
  }
};



// Get Chat List by User ID
export const getUserChatThread = async (currentUserId,otherUserId) => {
  try {
    const res = await instance.post(`/admin/chat/get`,{currentUserId,otherUserId}); // Replace with actual endpoint
    return res.data;
  } catch (err) {
    console.error('Chat fetch error:', err.response?.data || err.message);
    throw err;
  }
};






// Get Chat List by User ID
export const registerUser = async (newuser) => {
  try {
    const res = await instance.post(`/admin/register/user`,{name : newuser.name , password : newuser.password, mobile:newuser.mobile}); // Replace with actual endpoint
    return res.data;
  } catch (err) {
    console.error('Chat fetch error:', err.response?.data || err.message);
    throw err;
  }
};