// This file is generated automatically, do NOT modify it.

/// <reference path="../types.d.ts" />

import { createGetApi, createPostApi } from "@/api";

export const getRegistration = createPostApi<void, ApiTypes.GetRegistrationResponseDto>("registration/getRegistration", false);
export const registration = createPostApi<ApiTypes.RegistrationRequestDto, ApiTypes.RegistrationResponseDto>("registration/registration", false);
export const getRegistrationList = createPostApi<ApiTypes.GetRegistrationListRequestDto, ApiTypes.GetRegistrationListResponseDto>("registration/getRegistrationList", false);
export const approve = createPostApi<ApiTypes.ApproveRequestDto, ApiTypes.ApproveResponseDto>("registration/approve", false);
export const addOrganization = createPostApi<ApiTypes.AddOrganizationRequestDto, ApiTypes.AddOrganizationResponseDto>("registration/addOrganization", false);
