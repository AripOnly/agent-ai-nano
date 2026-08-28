import React, { useState, useEffect, useCallback } from "react";

import { settings } from "../../../src/config/setting.js";
import { loadModels } from "../../../src/config/models.js";

export function useConfig() {
  const [provider, setProvider] = useState("");
  const [model, setModel] = useState("");
  const [models, setModels] = useState({});

  const switchModel = useCallback(
    async (newModel) => {
      await settings.set("model", `${provider}/${newModel}`);

      setModel(newModel);
    },
    [provider],
  );

  useEffect(() => {
    async function loadConfig() {
      const [currentProvider, currentModel] = (
        await settings.get("model")
      ).split("/");

      const availableModels = await loadModels();

      setProvider(currentProvider);
      setModel(currentModel);
      setModels(availableModels);
    }

    loadConfig();
  }, []);

  return {
    model,
    provider,
    models,
    switchModel,
  };
}
