import React, { useEffect, useState } from "react";
import { useTranslation, Trans } from "next-i18next";
import Button from "./Button";
import {
  FaKey,
  FaMicrochip,
  FaThermometerFull,
  FaExclamationCircle,
  FaSyncAlt,
  FaCoins,
  FaCode,
  FaServer,
  FaBrain, // Icon for AI provider
} from "react-icons/fa";
import Dialog from "./Dialog";
import Input from "./Input";
import { GPT_MODEL_NAMES, GPT_4 } from "../utils/constants";
import {
  DEFAULT_HUGGING_FACE_MODEL,
  DEFAULT_GEMINI_MODEL,
} from "../utils/config";
import Accordion from "./Accordion";
import type { ModelSettings, SettingModel } from "../utils/types";
import { useGuestMode } from "../hooks/useGuestMode";
import clsx from "clsx";

type ProviderType = "openai" | "huggingface" | "gemini";

const PROVIDER_OPTIONS: { value: ProviderType; label: string }[] = [
  { value: "openai", label: "OpenAI" },
  { value: "huggingface", label: "Hugging Face" },
  { value: "gemini", label: "Google Gemini" },
];

export const SettingsDialog: React.FC<{
  show: boolean;
  close: () => void;
  customSettings: SettingModel;
}> = ({ show, close, customSettings }) => {
  const [settings, setSettings] = useState<ModelSettings>({
    ...customSettings.settings,
  });
  const [selectedProvider, setSelectedProvider] = useState<ProviderType>(
    () => {
      if (customSettings.settings.huggingFaceModelName) {
        return "huggingface";
      }
      if (customSettings.settings.geminiModelName) {
        return "gemini";
      }
      return "openai";
    }
  );
  const { isGuestMode } = useGuestMode(settings.customGuestKey);
  const { t } = useTranslation(["settings", "common"]);

  useEffect(() => {
    setSettings(customSettings.settings);
    // Re-determine provider when settings are externally updated or dialog is re-shown
    if (customSettings.settings.huggingFaceModelName) {
      setSelectedProvider("huggingface");
    } else if (customSettings.settings.geminiModelName) {
      setSelectedProvider("gemini");
    } else {
      setSelectedProvider("openai");
    }
  }, [customSettings, show]); // Added show to deps, as settings might not change if dialog is hidden then re-shown

  const updateSettings = <Key extends keyof ModelSettings>(
    key: Key,
    value: ModelSettings[Key]
  ) => {
    setSettings((prev) => {
      return { ...prev, [key]: value };
    });
  };

  const keyIsValid = (key: string | undefined) => {
    const pattern = /^(sk-[a-zA-Z0-9]{48}|[a-fA-F0-9]{32})$/;
    return key && pattern.test(key);
  };

  const urlIsValid = (url: string | undefined) => {
    if (url) {
      const pattern = /^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\/\S*)?$/;
      return pattern.test(url);
    }
    return true;
  };

  const handleSave = () => {
    if (
      selectedProvider === "openai" &&
      !isGuestMode &&
      !keyIsValid(settings.customApiKey)
    ) {
      alert(
        t(
          "OpenAI API Key is invalid, please ensure that you have set up billing in your OpenAI account!"
        )
      );
      return;
    }
    // Add similar key validation for HuggingFace and Gemini if they have standard key patterns
    // For now, we assume customApiKey is used for all and validated for OpenAI.

    if (!urlIsValid(settings.customEndPoint)) {
      alert(
        t(
          "Endpoint URL is invalid. Please ensure that you have set a correct URL."
        )
      );
      return;
    }

    const newSettings: ModelSettings = { ...settings };

    if (selectedProvider === "openai") {
      newSettings.huggingFaceModelName = undefined;
      newSettings.geminiModelName = undefined;
      // Ensure customModelName is set, or default if necessary (already handled by input)
    } else if (selectedProvider === "huggingface") {
      newSettings.customModelName = undefined;
      newSettings.geminiModelName = undefined;
      if (!newSettings.huggingFaceModelName) {
        newSettings.huggingFaceModelName = DEFAULT_HUGGING_FACE_MODEL;
      }
    } else if (selectedProvider === "gemini") {
      newSettings.customModelName = undefined;
      newSettings.huggingFaceModelName = undefined;
      if (!newSettings.geminiModelName) {
        newSettings.geminiModelName = DEFAULT_GEMINI_MODEL;
      }
    }

    customSettings.saveSettings(newSettings);
    close();
    return;
  };

  const handleReset = () => {
    // Reset needs to also reset the selected provider to default.
    customSettings.resetSettings(); // This will load default settings which should be OpenAI
    setSelectedProvider("openai"); // Explicitly set provider state
    close();
  };

  const handleProviderChange = (newProviderValue: string | undefined) => {
    if (newProviderValue) {
      const newProvider = newProviderValue as ProviderType;
      setSelectedProvider(newProvider);
      // Optional: Clear model name for the new provider if switching,
      // or set to default if not already set.
      // For now, we let existing values persist until save.
    }
  };

  const disabled =
    !isGuestMode && !settings.customApiKey && selectedProvider === "openai"; // API key only strictly required for OpenAI if not guest
  // For HuggingFace and Gemini, API key might be optional or handled differently (e.g. free tiers, env vars)
  // We'll keep the generic 'disabled' logic for advanced settings for now.
  const advancedDisabled = !isGuestMode && !settings.customApiKey;

  const advancedSettings = (
    <div className="flex flex-col gap-2">
      <Input
        left={
          <>
            <FaServer />
            <span className="ml-2">{t("endPoint")}</span>
          </>
        }
        disabled={advancedDisabled}
        value={settings.customEndPoint}
        onChange={(e) => updateSettings("customEndPoint", e.target.value)}
        toolTipProperties={{
          message: t("endpoint-tips", "Leave blank for default OpenAI/selected provider endpoint. Provide if using a proxy or custom Hugging Face/Gemini endpoint.") as string,
          disabled: false,
        }}
      />
      <Input
        left={
          <>
            <FaThermometerFull />
            <span className="ml-2">{t("temp")}</span>
          </>
        }
        value={settings.customTemperature ?? 0.9}
        onChange={(e) =>
          updateSettings("customTemperature", parseFloat(e.target.value))
        }
        type="range"
        toolTipProperties={{
          message: t("temp-tips") as string,
          disabled: false,
        }}
        attributes={{
          min: 0,
          max: 1.0, // Max temp for some models might be higher, but 1.0 is common
          step: 0.01,
        }}
      />
      <Input
        left={
          <>
            <FaSyncAlt />
            <span className="ml-2">{t("loop")}</span>
          </>
        }
        value={settings.customMaxLoops ?? 10}
        disabled={advancedDisabled}
        onChange={(e) =>
          updateSettings("customMaxLoops", parseFloat(e.target.value))
        }
        type="range"
        toolTipProperties={{
          message: t("loop-tips") as string,
          disabled: false,
        }}
        attributes={{
          min: 1,
          max: 25, // Reducing max loops from 100 to a more reasonable default
          step: 1,
        }}
      />
      <Input
        left={
          <>
            <FaCoins />
            <span className="ml-2">{t("tokens")}</span>
          </>
        }
        value={settings.customMaxTokens ?? 400} // Default to 400 if undefined
        disabled={advancedDisabled}
        onChange={(e) =>
          updateSettings("customMaxTokens", parseFloat(e.target.value))
        }
        type="range"
        toolTipProperties={{
          message: t("tokens-tips") as string,
          disabled: false,
        }}
        attributes={{
          min: 50, // Lowering min for more flexibility
          max: 8000, // Increasing max for models that support it
          step: 50,
        }}
      />
    </div>
  );

  return (
    <Dialog
      header={`${t("settings")} ⚙`}
      isShown={show}
      close={close}
      footerButton={
        <>
          <Button className="bg-red-400 hover:bg-red-500" onClick={handleReset}>
            {t("common:reset")}
          </Button>
          <Button onClick={handleSave}>{t("common:save")}</Button>
        </>
      }
    >
      <p>{t("usage")}</p>
      <p
        className={clsx(
          "my-2",
          settings.customModelName === GPT_4 &&
            "rounded-md border-[2px] border-white/10 bg-yellow-300 text-black"
        )}
      >
        <FaExclamationCircle className="inline-block" />
        &nbsp;
        <Trans i18nKey="gpt4-notice" ns="settings">
          <b>
            To use the GPT-4 model, you need to also provide the API key for
            GPT-4. You can request for it&nbsp;
            <a
              href="https://openai.com/waitlist/gpt-4-api"
              className="text-blue-500"
            >
              here
            </a>
            . (ChatGPT Plus subscription will not work)
          </b>
        </Trans>
      </p>
      <div className="mt-2 flex flex-col gap-2">
        <Input
          left={
            <>
              <FaBrain /> {/* Icon for AI provider */}
              <span className="ml-2">{t("provider", "Provider")}</span>
            </>
          }
          type="combobox"
          value={selectedProvider}
          onChange={() => null} // onChange is not used for combobox with setValue
          setValue={handleProviderChange}
          attributes={{
            options: PROVIDER_OPTIONS.map((p) => ({
              value: p.value,
              label: p.label,
            })),
          }}
        />
        <Input
          left={
            <>
              <FaKey />
              <span className="ml-2">
                {t("api-key-label", "API Key (for selected provider)")}
              </span>
            </>
          }
          placeholder={
            selectedProvider === "openai"
              ? "sk-..."
              : t("api-key-placeholder", "Enter API Key if required")
          }
          value={settings.customApiKey}
          onChange={(e) => updateSettings("customApiKey", e.target.value)}
          type="password"
          toolTipProperties={{
            message: t("api-key-tooltip", "API Key for the selected provider. For Hugging Face, this might be an Access Token. For Gemini, ensure your GCP project is configured or use an API key.") as string,
            disabled: false,
          }}
        />

        {selectedProvider === "openai" && (
          <Input
            left={
              <>
                <FaMicrochip />
                <span className="ml-2">{t("model")}</span>
              </>
            }
            type="combobox"
            value={settings.customModelName}
            onChange={() => null}
            setValue={(e) => updateSettings("customModelName", e)}
            attributes={{ options: GPT_MODEL_NAMES }}
            disabled={disabled}
          />
        )}
        {selectedProvider === "huggingface" && (
          <Input
            left={
              <>
                <FaMicrochip />
                <span className="ml-2">
                  {t("huggingface-model", "Hugging Face Model")}
                </span>
              </>
            }
            placeholder={DEFAULT_HUGGING_FACE_MODEL}
            value={settings.huggingFaceModelName ?? ""}
            onChange={(e) =>
              updateSettings("huggingFaceModelName", e.target.value)
            }
            toolTipProperties={{
              message: t("huggingface-model-tooltip", "e.g., gpt2, meta-llama/Llama-2-7b-chat-hf") as string,
              disabled: false,
            }}
          />
        )}
        {selectedProvider === "gemini" && (
          <Input
            left={
              <>
                <FaMicrochip />
                <span className="ml-2">{t("gemini-model", "Gemini Model")}</span>
              </>
            }
            placeholder={DEFAULT_GEMINI_MODEL}
            value={settings.geminiModelName ?? ""}
            onChange={(e) => updateSettings("geminiModelName", e.target.value)}
            toolTipProperties={{
              message: t("gemini-model-tooltip", "e.g., gemini-pro, gemini-1.5-pro-latest") as string,
              disabled: false,
            }}
          />
        )}

        {isGuestMode && (
          <Input
            left={
              <>
                <FaCode />
                <span className="ml-2">{t("guest-key")}</span>
              </>
            }
            value={settings.customGuestKey}
            onChange={(e) => updateSettings("customGuestKey", e.target.value)}
            type="password"
          />
        )}
        <Accordion
          child={advancedSettings}
          name={t("advanced-settings")}
        ></Accordion>
      </div>
      <Trans i18nKey="api-key-provider-notice" ns="settings">
        <strong className="mt-10">
          NOTE: Ensure your API key is valid for the selected provider. For
          OpenAI, get keys
          <a
            href="https://platform.openai.com/account/api-keys"
            className="text-blue-500"
          >
            here
          </a>
          . For Hugging Face, it may be an Access Token. For Gemini, refer to
          Google Cloud console. This key is only used in the current browser
          session.
        </strong>
      </Trans>
    </Dialog>
  );
};
