import { instance } from "common/api/api";
import { BaseResponseType } from "common/types";
import { LoginParamsType } from "features/Auth/ui/login/Login";

export const authAPI = {
  login(data: LoginParamsType) {
    return instance.post<BaseResponseType<{ userId?: number }>>("auth/login", data);
  },
  logout() {
    return instance.delete<BaseResponseType<{ userId?: number }>>("auth/login");
  },
  me() {
    return instance.get<BaseResponseType<{ id: number; email: string; login: string }>>("auth/me");
  },
  security() {
    return instance.put<BaseResponseType>(`security/get-captcha-url`)
  }
};
