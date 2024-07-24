import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const apiPathUrl = {
  signup: "/auth/signup",
  signin: "/auth/signin",
  user: "/user",
  books: "/books",
  progresses:"/progresses",
  target_settings: "/target_settings",
};

// APIリクエストのベース
const apiRequest = async({ method, apiEndpoint, data={}, token }) => {
  try {
    const response = await axios({
      method: method,
      url: apiBaseUrl + apiEndpoint,
      data: data,
      headers: {
        'Content-Type': 'application/json',
        ...(token && {'Authorization': `Bearer ${token}`}), // トークンが存在する場合のみ設定
      },
    });
    // console.log("apiRequest.Response:", response);
    return response;
  } catch (error) {
    console.log('apiRequest failed', error);
    throw error;    
  }
};

// サインアップ
export const signupRequest = async(name, email, password) => {
  const response = await apiRequest({
    method: "POST", 
    apiEndpoint: apiPathUrl.signup, 
    data: {
      name: name,
      email: email,
      password: password,
    }, 
  });
  return response;
};
