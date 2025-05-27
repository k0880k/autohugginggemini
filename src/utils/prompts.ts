import { OpenAI } from "langchain/llms/openai";
import { HuggingFaceInference } from "@langchain/community/llms/hf";
import { VertexAI } from "@langchain/google-vertexai";
import { PromptTemplate } from "langchain/prompts";
import type { ModelSettings } from "./types";
import { GPT_35_TURBO } from "./constants";

const getServerSideKey = (): string => {
  const keys: string[] = (process.env.OPENAI_API_KEY || "")
    .split(",")
    .map((key) => key.trim())
    .filter((key) => key.length);

  return keys[Math.floor(Math.random() * keys.length)] || "";
};

export const createModel = (settings: ModelSettings) => {
  const temperature = settings.customTemperature ?? 0.9;
  const maxTokens = settings.customMaxTokens ?? 400;
  const customApiKey = settings.customApiKey;
  const customEndPoint = settings.customEndPoint;

  if (settings.huggingFaceModelName) {
    const hfOptions: ConstructorParameters<typeof HuggingFaceInference>[0] = {
      model: settings.huggingFaceModelName,
      temperature,
      maxTokens,
    };
    if (customApiKey) {
      hfOptions.apiKey = customApiKey;
    }
    if (customEndPoint) {
      hfOptions.endpoint = customEndPoint;
    }
    return new HuggingFaceInference(hfOptions);
  }

  if (settings.geminiModelName) {
    const vertexAIOptions: ConstructorParameters<typeof VertexAI>[0] = {
      model: settings.geminiModelName,
      temperature,
      maxOutputTokens: maxTokens, // VertexAI uses maxOutputTokens
    };
    // VertexAI uses ADC or GOOGLE_API_KEY env var by default if apiKey is not directly passed
    // For explicit key usage, one might need to configure authOptions depending on the environment (Node vs Web)
    // and specific auth requirements, which is beyond simple apiKey mapping here.
    // If customApiKey is intended for VertexAI, further logic for authOptions would be needed.
    // The existing getServerSideKey() is for OpenAI, so not directly applicable.
    // For now, relying on environment-based auth for VertexAI.
    return new VertexAI(vertexAIOptions);
  }

  // Default to OpenAI
  const openAIOptions: ConstructorParameters<typeof OpenAI>[0] = {
    openAIApiKey: customApiKey || getServerSideKey(),
    temperature,
    modelName: settings.customModelName || GPT_35_TURBO,
    maxTokens,
  };

  const openAIBaseOptions: ConstructorParameters<typeof OpenAI>[1] = {
    basePath: customEndPoint || undefined,
  };

  return new OpenAI(openAIOptions, openAIBaseOptions);
};

export const startGoalPrompt = new PromptTemplate({
  template: `You are a task creation AI called AgentGPT. You must answer the "{customLanguage}" language. You are not a part of any system or device. You have the following objective "{goal}". Create a list of zero to three tasks to be completed by your AI system such that this goal is more closely, or completely reached. You have access to google search for tasks that require current events or small searches. Return the response as a formatted ARRAY of strings that can be used in JSON.parse(). Example: ["{{TASK-1}}", "{{TASK-2}}"].`,
  inputVariables: ["goal", "customLanguage"],
});

export const analyzeTaskPrompt = new PromptTemplate({
  template: `You have the following higher level objective "{goal}". You currently are focusing on the following task: "{task}". Based on this information, evaluate what the best action to take is strictly from the list of actions: {actions}. You should use 'search' only for research about current events where "arg" is a simple clear search query based on the task only. Use "reason" for all other actions. Return the response as an object of the form {{ "action": "string", "arg": "string" }} that can be used in JSON.parse() and NOTHING ELSE.`,
  inputVariables: ["goal", "actions", "task"],
});

export const executeTaskPrompt = new PromptTemplate({
  template:
    'Answer in the "{customLanguage}" language. Given the following overall objective `{goal}` and the following sub-task, `{task}`. Perform the task in a detailed manner. If coding is required, provide code in markdown',
  inputVariables: ["goal", "task", "customLanguage"],
});

export const createTasksPrompt = new PromptTemplate({
  template:
    'You are an AI task creation agent. You must answer in the "{customLanguage}" language. You have the following objective `{goal}`. You have the following incomplete tasks `{tasks}` and have just executed the following task `{lastTask}` and received the following result `{result}`. Based on this, create a new task to be completed by your AI system ONLY IF NEEDED such that your goal is more closely reached or completely reached. Return the response as an array of strings that can be used in JSON.parse() and NOTHING ELSE.',
  inputVariables: ["goal", "tasks", "lastTask", "result", "customLanguage"],
});

export const summarizeSearchSnippets = new PromptTemplate({
  template: `Summarize the following snippets "{snippets}" from google search results filling in information where necessary. This summary should answer the following query: "{query}" with the following goal "{goal}" in mind. Return the summary as a string. Do not show you are summarizing.`,
  inputVariables: ["goal", "query", "snippets"],
});
