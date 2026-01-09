// src/services/estimationService.ts

import axiosInstance from '../core/axios/axiosInstance';
import type { GenerateEstimationDto, EstimationResponseDto } from '../core/models/Estimation';
import { ESTIMATIONS } from '../global/endpoints';

export const estimationService = {
  generateEstimation: async (data: GenerateEstimationDto): Promise<EstimationResponseDto> => {
    const response = await axiosInstance.post<EstimationResponseDto>(ESTIMATIONS.GENERATE, data);
    return response.data;
  },
};
