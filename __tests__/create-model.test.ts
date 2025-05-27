import { createModel } from "../src/utils/prompts";
import { GPT_35_TURBO } from "../src/utils/constants";
import type { ModelSettings } from "../src/utils/types";
import { OpenAI } from "langchain/llms/openai";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { VertexAI } from "@langchain/google-vertexai";

// Mock the external modules
jest.mock("langchain/llms/openai");
jest.mock("@langchain/community/llms/hf");
jest.mock("@langchain/google-vertexai");

const MockedOpenAI = OpenAI as jest.MockedClass<typeof OpenAI>;
const MockedHuggingFaceInference = HuggingFaceInference as jest.MockedClass<
  typeof HuggingFaceInference
>;
const MockedVertexAI = VertexAI as jest.MockedClass<typeof VertexAI>;

// Helper to get the first argument of the first call to a mock constructor
const getConstructorArgs = (mock: jest.MockedClass<any>) => {
  return mock.mock.calls[0][0];
};

const getConstructorBaseArgs = (mock: jest.MockedClass<any>) => {
  return mock.mock.calls[0][1];
};

describe("createModel", () => {
  beforeEach(() => {
    // Clear all mock instances and calls before each test
    MockedOpenAI.mockClear();
    MockedHuggingFaceInference.mockClear();
    MockedVertexAI.mockClear();
  });

  describe("OpenAI", () => {
    test("should use custom settings when API key is provided", () => {
      const settings: ModelSettings = {
        customApiKey: "test_api_key_openai",
        customTemperature: 0.22,
        customModelName: "Custom_OpenAI_Model",
        customMaxTokens: 1234,
        customEndPoint: "https://custom.openai.com/v1",
      };
      createModel(settings);
      expect(MockedOpenAI).toHaveBeenCalledTimes(1);
      const options = getConstructorArgs(MockedOpenAI);
      const baseOptions = getConstructorBaseArgs(MockedOpenAI);

      expect(options.openAIApiKey).toBe(settings.customApiKey);
      expect(options.temperature).toBe(settings.customTemperature);
      expect(options.modelName).toBe(settings.customModelName);
      expect(options.maxTokens).toBe(settings.customMaxTokens);
      expect(baseOptions.basePath).toBe(settings.customEndPoint);
    });

    test("should use default settings and getServerSideKey when API key is not provided", () => {
      const settings: ModelSettings = {
        // customApiKey is missing
      };
      createModel(settings);
      expect(MockedOpenAI).toHaveBeenCalledTimes(1);
      const options = getConstructorArgs(MockedOpenAI);

      expect(options.openAIApiKey).toBeDefined(); // Relies on getServerSideKey, check if it's called or a key is present
      expect(options.temperature).toBe(0.9); // Default
      expect(options.modelName).toBe(GPT_35_TURBO); // Default
      expect(options.maxTokens).toBe(400); // Default
    });

     test("should use default model name if customModelName is not provided", () => {
      const settings: ModelSettings = { customApiKey: "test_key" };
      createModel(settings);
      expect(MockedOpenAI).toHaveBeenCalledTimes(1);
      const options = getConstructorArgs(MockedOpenAI);
      expect(options.modelName).toBe(GPT_35_TURBO);
    });

    test("should use default temperature if customTemperature is not provided", () => {
      const settings: ModelSettings = { customApiKey: "test_key" };
      createModel(settings);
      expect(MockedOpenAI).toHaveBeenCalledTimes(1);
      const options = getConstructorArgs(MockedOpenAI);
      expect(options.temperature).toBe(0.9);
    });

    test("should use default maxTokens if customMaxTokens is not provided", () => {
      const settings: ModelSettings = { customApiKey: "test_key" };
      createModel(settings);
      expect(MockedOpenAI).toHaveBeenCalledTimes(1);
      const options = getConstructorArgs(MockedOpenAI);
      expect(options.maxTokens).toBe(400);
    });
  });

  describe("Hugging Face", () => {
    const hfModelName = "gpt2-test";
    test("should call HuggingFaceInference with all custom settings", () => {
      const settings: ModelSettings = {
        huggingFaceModelName: hfModelName,
        customApiKey: "test_api_key_hf",
        customTemperature: 0.33,
        customMaxTokens: 555,
        customEndPoint: "https://custom.hf.co/models",
      };
      createModel(settings);
      expect(MockedHuggingFaceInference).toHaveBeenCalledTimes(1);
      const options = getConstructorArgs(MockedHuggingFaceInference);

      expect(options.model).toBe(hfModelName);
      expect(options.apiKey).toBe(settings.customApiKey);
      expect(options.endpoint).toBe(settings.customEndPoint);
      expect(options.temperature).toBe(settings.customTemperature);
      expect(options.maxTokens).toBe(settings.customMaxTokens);
    });

    test("should call HuggingFaceInference without apiKey and endpoint if not provided", () => {
      const settings: ModelSettings = {
        huggingFaceModelName: hfModelName,
        // customApiKey and customEndPoint are missing
      };
      createModel(settings);
      expect(MockedHuggingFaceInference).toHaveBeenCalledTimes(1);
      const options = getConstructorArgs(MockedHuggingFaceInference);

      expect(options.model).toBe(hfModelName);
      expect(options.apiKey).toBeUndefined();
      expect(options.endpoint).toBeUndefined();
      expect(options.temperature).toBe(0.9); // Default
      expect(options.maxTokens).toBe(400); // Default
    });
  });

  describe("Gemini/VertexAI", () => {
    const geminiModelName = "gemini-pro-test";
    test("should call VertexAI with custom temperature and maxOutputTokens", () => {
      const settings: ModelSettings = {
        geminiModelName: geminiModelName,
        customTemperature: 0.44,
        customMaxTokens: 666,
      };
      createModel(settings);
      expect(MockedVertexAI).toHaveBeenCalledTimes(1);
      const options = getConstructorArgs(MockedVertexAI);

      expect(options.model).toBe(geminiModelName);
      expect(options.temperature).toBe(settings.customTemperature);
      expect(options.maxOutputTokens).toBe(settings.customMaxTokens);
    });

    test("should call VertexAI with default temperature and maxOutputTokens if not provided", () => {
      const settings: ModelSettings = {
        geminiModelName: geminiModelName,
      };
      createModel(settings);
      expect(MockedVertexAI).toHaveBeenCalledTimes(1);
      const options = getConstructorArgs(MockedVertexAI);

      expect(options.model).toBe(geminiModelName);
      expect(options.temperature).toBe(0.9); // Default
      expect(options.maxOutputTokens).toBe(400); // Default
    });
  });

  describe("Provider Priority", () => {
    test("should prioritize Hugging Face if multiple provider models are set", () => {
      const settings: ModelSettings = {
        huggingFaceModelName: "hf-model",
        geminiModelName: "gemini-model",
        customModelName: "openai-model",
        customApiKey: "anykey"
      };
      createModel(settings);
      expect(MockedHuggingFaceInference).toHaveBeenCalledTimes(1);
      expect(MockedVertexAI).not.toHaveBeenCalled();
      expect(MockedOpenAI).not.toHaveBeenCalled();
      const options = getConstructorArgs(MockedHuggingFaceInference);
      expect(options.model).toBe("hf-model");
    });

    test("should prioritize Gemini if Hugging Face is not set but Gemini and OpenAI are", () => {
      const settings: ModelSettings = {
        geminiModelName: "gemini-model",
        customModelName: "openai-model",
         customApiKey: "anykey"
      };
      createModel(settings);
      expect(MockedHuggingFaceInference).not.toHaveBeenCalled();
      expect(MockedVertexAI).toHaveBeenCalledTimes(1);
      expect(MockedOpenAI).not.toHaveBeenCalled();
      const options = getConstructorArgs(MockedVertexAI);
      expect(options.model).toBe("gemini-model");
    });

    test("should default to OpenAI if no provider-specific model name is given", () => {
      const settings: ModelSettings = {
        customApiKey: "test_key_openai_default",
        customModelName: "specific-openai-model",
      };
      createModel(settings);
      expect(MockedOpenAI).toHaveBeenCalledTimes(1);
      expect(MockedHuggingFaceInference).not.toHaveBeenCalled();
      expect(MockedVertexAI).not.toHaveBeenCalled();
      const options = getConstructorArgs(MockedOpenAI);
      expect(options.modelName).toBe("specific-openai-model");
    });
  });
});
