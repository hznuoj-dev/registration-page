// This file is generated automatically, do NOT modify it.

/// <reference path="../types.d.ts" />

import { createGetApi, createPostApi } from "@/api";

export const getSessionInfo = createGetApi<{ token?: string, jsonp?: string }, ApiTypes.GetSessionInfoResponseDto>("auth/getSessionInfo");
export const login = createPostApi<ApiTypes.LoginRequestDto, ApiTypes.LoginResponseDto>("auth/login", true);
export const logout = createPostApi<void, void>("auth/logout", false);
export const sendEmailVerificationCode = createPostApi<ApiTypes.SendEmailVerificationCodeRequestDto, ApiTypes.SendEmailVerificationCodeResponseDto>("auth/sendEmailVerificationCode", false);
