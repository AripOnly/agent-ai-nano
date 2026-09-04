import { useCallback, useState } from "react";

const API_URL = "http://127.0.0.1:3000";

export function useConfig() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadConfig = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/config`);

      if (!response.ok) {
        throw new Error(`Failed to load config: ${response.status}`);
      }

      const data = await response.json();

      setConfig(data);

      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (changes) => {
    const response = await fetch(`${API_URL}/api/config`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changes),
    });

    if (!response.ok) {
      throw new Error(`Failed to update config: ${response.status}`);
    }

    const data = await response.json();

    setConfig(data);

    return data;
  }, []);

  return {
    config,
    loading,
    loadConfig,
    updateConfig,
  };
}
