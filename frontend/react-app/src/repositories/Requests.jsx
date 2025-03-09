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
const apiRequest = async({ method, apiEndpoint, data={}, token, isFormUrlEncoded = false }) => {
  try {
    const headers = {
      ...(isFormUrlEncoded
        ? { "Content-Type": "application/x-www-form-urlencoded" } // Formで送信したい時（signup）に使用
        : { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }), // トークンが存在する場合のみ設定
    };

    const response = await axios({
      method: method,
      url: apiBaseUrl + apiEndpoint,
      data: data,
      headers: headers,
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

// サインイン
// メールアドレスでログインさせたいが、バックエンド側のOAuth2PasswordBearerが
// usernameを受け取る必要があるため、メールアドレスをusernameとして送信する
// OAuth2PasswordRequestForm は Formデータを受け取る仕様
// →application/x-www-form-urlencodedを指定すれば、dataはaxiosで自動的に対応形式にシリアライズされる
export const signinRequest = async(email, password) => {
  const response = await apiRequest({
    method: "POST", 
    apiEndpoint: apiPathUrl.signin, 
    data: {
      username: email,
      password: password,
    },
    isFormUrlEncoded: true,
  });
  return response;
};

// ユーザー情報の取得
export const fetchUserRequest = async(token) => {
  const response = await apiRequest({
    method: "GET", 
    apiEndpoint: apiPathUrl.user, 
    token : token,
  });
  return response;
};

// ユーザー名の変更
export const updateUsernameRequest = async(token, newname) => {
  const response = await apiRequest({
    method: "PUT", 
    apiEndpoint: apiPathUrl.user,
    token : token, 
    data: {
      name: newname,
    }, 
  });
  return response;
};

// 本一覧の取得
export const fetchBooksListRequest = async(token) => {
  const response = await apiRequest({
    method: "GET", 
    apiEndpoint: apiPathUrl.books, 
    token : token,
  });
  return response;
};

// 目標ページ数の変更
export const updateTargetPagesRequest = async(token, bookId, newTargetPages) => {
  const response = await apiRequest({
    method: "PUT", 
    apiEndpoint: apiPathUrl.target_settings + "/" + bookId,
    token : token, 
    data: {
      target_pages: newTargetPages,
    }, 
  });
  return response;
};

// 本の新規登録
export const createBookRequest = async(token, title, firstPage, lastPage, targetPages) => {
  const response = await apiRequest({
    method: "POST", 
    apiEndpoint: apiPathUrl.books,
    token : token, 
    data: {
      title: title,
      first_page: firstPage,
      last_page: lastPage,
      target_pages: targetPages,
    }, 
  });
  return response;
};