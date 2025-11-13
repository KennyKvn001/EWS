import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  vi,
} from "vitest";
import { PredictionApiService } from "@/services/predictionApi";
import type { PredictionFormData } from "@/types/prediction";

describe("PredictionApiService Integration Tests", () => {
  let apiService: PredictionApiService;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeAll(() => {
    apiService = new PredictionApiService(
      "https://ews-mcr0.onrender.com",
      10000,
      {
        maxRetries: 1,
        baseDelay: 100,
        maxDelay: 500,
        backoffMultiplier: 2,
      }
    );

    fetchMock = vi.fn();
    global.fetch = fetchMock as any;
  });

  afterEach(() => {
    fetchMock.mockClear();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe("predictWithExplanation", () => {
    it("should call the /predict_with_xai endpoint once", async () => {
      const mockFormData: PredictionFormData = {
        age_at_enrollment: 20,
        gender: "male",
        total_units_approved: 15,
        average_grade: 75,
        total_units_evaluated: 18,
        total_units_enrolled: 20,
        previous_qualification_grade: 80,
        tuition_fees_up_to_date: true,
        scholarship_holder: false,
        debtor: false,
      };

      const mockResponse = {
        prediction: {
          prediction: 0,
          label: "Graduate",
          probability: {
            dropout: 0.25,
            graduate: 0.75,
          },
          risk_category: "low",
        },
        explanation: {
          feature_impacts: [
            {
              feature: "average_grade",
              dropout_impact: -0.15,
              graduate_impact: 0.15,
              interpretation: "Protective factor",
            },
          ],
          summary: {
            most_influential_feature: "average_grade",
            strongest_dropout_factor: "debtor",
            strongest_protective_factor: "average_grade",
          },
        },
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await apiService.predictWithExplanation(mockFormData);

      expect(fetchMock).toHaveBeenCalledTimes(1);

      expect(fetchMock).toHaveBeenCalledWith(
        "https://ews-mcr0.onrender.com/predict_with_xai",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );

      const callArgs = fetchMock.mock.calls[0];
      const requestInit = callArgs[1] as RequestInit;
      const requestBody = JSON.parse(requestInit.body as string);
      expect(requestBody).toEqual({
        total_units_approved: 15,
        average_grade: 75,
        age_at_enrollment: 20,
        total_units_evaluated: 18,
        total_units_enrolled: 20,
        previous_qualification_grade: 80,
        tuition_fees_up_to_date: 0,
        scholarship_holder: 1, 
        debtor: 0,
        gender: 1,
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe("createStudentWithPrediction", () => {
    it("should call the /students/create-with-prediction endpoint once", async () => {
      const mockFormData: PredictionFormData = {
        age_at_enrollment: 22,
        gender: "female",
        total_units_approved: 12,
        average_grade: 85,
        total_units_evaluated: 15,
        total_units_enrolled: 18,
        previous_qualification_grade: 90,
        tuition_fees_up_to_date: true,
        scholarship_holder: true,
        debtor: false,
      };

      const mockResponse = {
        id: "test-uuid-123",
        age_at_enrollment: 22,
        gender: "female",
        total_units_approved: 12,
        average_grade: 85,
        total_units_evaluated: 15,
        total_units_enrolled: 18,
        previous_qualification_grade: 90,
        tuition_fees_up_to_date: true,
        scholarship_holder: true,
        debtor: false,
        uploaded_by: "test-user",
        risk_score: 0.15,
        risk_category: "low",
        last_prediction_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => mockResponse,
      });

      const result = await apiService.createStudentWithPrediction(
        mockFormData,
        "test-user"
      );

      expect(fetchMock).toHaveBeenCalledTimes(1);

      expect(fetchMock).toHaveBeenCalledWith(
        "https://ews-mcr0.onrender.com/students/create-with-prediction",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      );

      const callArgs = fetchMock.mock.calls[0];
      const requestInit = callArgs[1] as RequestInit;
      const requestBody = JSON.parse(requestInit.body as string);
      expect(requestBody).toEqual({
        age_at_enrollment: 22,
        gender: 0,
        total_units_approved: 12,
        average_grade: 85,
        total_units_evaluated: 15,
        total_units_enrolled: 18,
        previous_qualification_grade: 90,
        tuition_fees_up_to_date: 0,
        scholarship_holder: 0,
        debtor: 0,
        uploaded_by: "test-user",
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetchAtRiskStudents", () => {
    it("should call the /students/at-risk endpoint once", async () => {
      const mockResponse = {
        students: [
          {
            id: "student-1",
            age_at_enrollment: 19,
            gender: "male",
            total_units_approved: 5,
            average_grade: 45,
            total_units_evaluated: 10,
            total_units_enrolled: 15,
            previous_qualification_grade: 50,
            tuition_fees_up_to_date: false,
            scholarship_holder: false,
            debtor: true,
            uploaded_by: "admin",
            risk_score: 0.85,
            risk_category: "high",
            last_prediction_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ],
        total: 1,
        skip: 0,
        limit: 100,
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      const result = await apiService.fetchAtRiskStudents(0, 100);

      expect(fetchMock).toHaveBeenCalledTimes(1);

      expect(fetchMock).toHaveBeenCalledWith(
        "https://ews-mcr0.onrender.com/students/at-risk?skip=0&limit=100",
        expect.objectContaining({
          method: "GET",
        })
      );

      expect(result).toEqual(mockResponse);
    });

    it("should call the endpoint with custom skip and limit parameters", async () => {
      const mockResponse = {
        students: [],
        total: 0,
        skip: 10,
        limit: 50,
      };

      fetchMock.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
      });

      await apiService.fetchAtRiskStudents(10, 50);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        "https://ews-mcr0.onrender.com/students/at-risk?skip=10&limit=50",
        expect.objectContaining({
          method: "GET",
        })
      );
    });
  });
});
