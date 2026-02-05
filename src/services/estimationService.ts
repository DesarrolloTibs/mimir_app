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
    const response = await axiosInstance.get<any>(ESTIMATIONS.GET_BY_REQUIREMENT(requirementId));
    
    // Adapter: If response is an array of items, transform to EstimationResponseDto
    if (Array.isArray(response.data)) {
      const items = response.data;
      const tasks = items.map((item: any) => ({
        description: item.taskDescription,
        layer: item.layer,
        hours: parseFloat(item.aiSuggestedHours),
        reason: item.aiReasoning
      }));

      const totalHours = tasks.reduce((sum: number, task: any) => sum + task.hours, 0);
      const avgConfidence = items.length > 0
        ? items.reduce((sum: number, item: any) => sum + (item.aiConfidenceScore || 0), 0) / items.length
        : 0;

      return {
        summary: "Estimación recuperada del historial",
        tasks: tasks,
        totalHours: totalHours,
        confidenceScore: Math.round(avgConfidence),
        estimationItems: items
      };
    }

    return response.data;
  },
};
