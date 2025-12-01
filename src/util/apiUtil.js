import axios from 'axios';

// API 요청
const sendApi = async (path, httpMethod, requestData) => {

    let response = null;

    let headers = {
        Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
        'Content-Type': 'application/json'
    };

    // API 요청
    try {
        if(httpMethod === "GET") {
            response = await axios.get(path, {
                headers: headers,
                params: requestData
            });
        }
        else if(httpMethod === "POST") {
            response = await axios.post(path, requestData, {
                headers: headers
            });
        }

        return response.data?.data;

    } catch(error) {
        if(error.response && error.response?.data && error.response?.data?.code === "NOT_LOGIN")
        {
            // access token 재발급
            const isSuccess = await refreshAccessToken();

            // API 재요청
            if(isSuccess)
            {
                // 헤더 초기화
                headers = {
                    Authorization: `Bearer ${window.localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json'
                };

                try {
                    if(httpMethod === "GET") {
                        response = await axios.get(path, {
                            headers: headers,
                            params: requestData
                        });
                    }
                    else if(httpMethod === "POST") {
                        response = await axios.post(path, requestData, {
                            headers: headers
                        });
                    }

                    return response.data?.data;
                } catch (error) {
                    throw error;
                }
            } else {
                throw error;
            }
        } else {
            throw error;
        }
    }
};

// access token 재발급
const refreshAccessToken = async () => {

    // access token 재발급 성공 여부
    let isSuccess = false;

    // access token 재발급 요청
    await axios.get(
        '/user/refresh-access-token'
    ).then((response) => {
        const cookies = document.cookie.split(";");

        for(let i = 0; i < cookies.length; i++)
        {
            const cookie = cookies[i].trim();

            if(cookie.startsWith("access-token="))
            {
                const accessToken = cookie.substring("access-token".length + 1);

                window.localStorage.setItem("accessToken", accessToken);
                isSuccess = true;
            }
        }
    });

    // access token 재발급 성공 여부 반환
    return isSuccess;
};

export { sendApi, refreshAccessToken };