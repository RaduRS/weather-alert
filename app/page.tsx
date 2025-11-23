"use client";
import { useState } from "react";

type WeatherCheckResponse = {
  checked: boolean;
  snow?: boolean;
  lowTemp?: number | null;
  frostRisk?: boolean;
  sent?: boolean;
  error?: string;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WeatherCheckResponse | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const IconThermometer = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M14 14.76V5a2 2 0 10-4 0v9.76a4 4 0 104 0z" stroke="#6b7280" strokeWidth="1.5" />
      <path d="M10 9h4" stroke="#6b7280" strokeWidth="1.5" />
    </svg>
  );
  const IconSnowflake = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 3v18M3 12h18M5 7l14 10M19 7L5 17" stroke="#6b7280" strokeWidth="1.5" />
    </svg>
  );
  const IconFrost = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 3l3 5 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1 3-5z" stroke="#6b7280" strokeWidth="1.5" />
    </svg>
  );

  const callEndpoint = async (force: boolean) => {
    try {
      setLoading(true);
      setMessage(null);
      setResult(null);
      const res = await fetch(`/api/weather-alert${force ? "?force=1" : ""}`, {
        method: "GET",
        cache: "no-store",
      });
      const data = (await res.json()) as WeatherCheckResponse;
      setResult(data);
      if (data.error) {
        setMessage("Error: " + data.error);
      } else if (data.sent) {
        setMessage("Email sent");
      } else {
        setMessage("No alert sent");
      }
    } catch {
      setMessage("Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-zinc-900 shadow-sm ring-1 ring-zinc-200/60 dark:ring-zinc-800 p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Weather Alert Tester
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => callEndpoint(true)}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Test Email"}
          </button>
          <button
            onClick={() => callEndpoint(false)}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "Checking..." : "Check Tonight Conditions"}
          </button>
        </div>

        <div className="min-h-[56px]">
          {message && (
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {message}
            </div>
          )}
          {result && !result.error && (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
                <div className="text-zinc-500 dark:text-zinc-400 inline-flex items-center gap-2"><IconSnowflake /> Snow</div>
                <div className="font-medium text-zinc-900 dark:text-zinc-100">
                  {String(result.snow ?? false)}
                </div>
              </div>
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
                <div className="text-zinc-500 dark:text-zinc-400 inline-flex items-center gap-2"><IconThermometer /> Low Temp</div>
                <div className="font-medium text-zinc-900 dark:text-zinc-100">
                  {result.lowTemp ?? "-"}°C
                </div>
              </div>
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
                <div className="text-zinc-500 dark:text-zinc-400 inline-flex items-center gap-2"><IconFrost /> Frost Risk</div>
                <div className="font-medium text-zinc-900 dark:text-zinc-100">
                  {String(result.frostRisk ?? false)}
                </div>
              </div>
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-3">
                <div className="text-zinc-500 dark:text-zinc-400">Sent</div>
                <div className="font-medium text-zinc-900 dark:text-zinc-100">
                  {String(result.sent ?? false)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
