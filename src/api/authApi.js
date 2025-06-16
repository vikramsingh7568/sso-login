import instance from './axios';

// 2. Function to verify OTP and log in
export const loginWithEmail = async (email, password) => {
  try {
    console.log('calling');
    const response = await instance.post('/user/login', { email, password });
    return response.data; // Assuming the backend returns some kind of success message or token
  } catch (error) {
    // If error.response is available, show the backend error message, otherwise show a generic error message
    const errorMessage = error.response 
      ? error.response.data.message || 'Login failed, please try again'
      : 'An unexpected error occurred. Please try again later.';
    
    alert(errorMessage); // Show error message in alert

    console.error('Error verifying OTP:', errorMessage);
    throw error;
  }
};



export const logoutAdmin  = async () => {
  try {
    console.log('calling');
    const response = await instance.post('/admin/logout',{});
    return response.data; // Assuming the backend returns some kind of success message or token
  } catch (error) {
    // If error.response is available, show the backend error message, otherwise show a generic error message
    const errorMessage = error.response 
      ? error.response.data.message || 'Login failed, please try again'
      : 'An unexpected error occurred. Please try again later.';
    
    alert(errorMessage); // Show error message in alert

    console.error('Error verifying OTP:', errorMessage);
    throw error;
  }
};

