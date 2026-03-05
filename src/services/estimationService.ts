// src/services/estimationService.ts

import axiosInstance from '../core/axios/axiosInstance';
import type { GenerateEstimationDto, EstimationResponseDto } from '../core/models/Estimation';
import { ESTIMATIONS } from '../global/endpoints';

export const estimationService = {
  generateEstimation: async (data: GenerateEstimationDto): Promise<EstimationResponseDto> => {
    const response = await axiosInstance.post<EstimationResponseDto>(ESTIMATIONS.GENERATE, data);
    return response.data;
  },
  getEstimationByRequirementId: async (requirementId: string): Promise<EstimationResponseDto> => {
    const response = await axiosInstance.get<EstimationResponseDto>(ESTIMATIONS.GET_BY_REQUIREMENT(requirementId));
    return response.data;
  },
  getProjectEstimations: async (projectId: string): Promise<any[]> => {
    const response = await axiosInstance.get<any[]>(ESTIMATIONS.GET_BY_PROJECT(projectId));
    return response.data;
  }
};
