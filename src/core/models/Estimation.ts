// src/core/models/Estimation.ts

export interface GenerateEstimationDto {
  projectId: string;
  documentId: string;
  requirementText?: string;
}

export interface EstimationTaskDto {
  description: string;
  layer: string;
  hours: number;
  reason: string;
}

export interface EstimationResponseDto {
  summary: string;
  tasks: EstimationTaskDto[];
  estimationItems?: any[]; // Fallback for different response structure
  totalHours: number;
  confidenceScore: number;
}
