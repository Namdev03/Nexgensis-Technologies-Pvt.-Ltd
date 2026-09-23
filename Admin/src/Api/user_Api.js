
import { apiEndPoint } from "../Routes/apiEndPoint"
import { axiosInstance } from "../Service/axiosInstance"

export const LoginApi = async (payload) => {
    try {
        const response = await axiosInstance.post(apiEndPoint.LOGIN,payload);
        return response.data; 
    } catch (error) {
        console.error("Login API Error:", error);
        throw error;
    }
}