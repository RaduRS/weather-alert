"use client";
import { useState } from "react";
import {
  CloudSnow,
  Thermometer,
  Snowflake,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

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

  const callEndpoint = async () => {
    try {
      setLoading(true);
      setMessage(null);
      setResult(null);
      const res = await fetch(`/api/weather-alert`, {
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50 dark:from-zinc-900 dark:via-black dark:to-zinc-900 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-xl ring-1 ring-white/20 dark:ring-zinc-800/50 p-8 flex flex-col gap-8">
        <div className="flex flex-col gap-3 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 mx-auto bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
            <Snowflake className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-zinc-900 to-zinc-700 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent">
            Weather Alert System
          </h1>
          <p className="text-zinc-700 dark:text-zinc-200 text-sm">
            Monitor weather conditions and receive alerts for critical
            thresholds
          </p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={callEndpoint}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 text-sm font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Checking...
              </>
            ) : (
              "Check Conditions"
            )}
          </button>
        </div>

        <div>
          {message && (
            <div
              className={`text-sm font-medium p-4 rounded-xl border ${
                message.includes("Error")
                  ? "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
                  : message.startsWith("Email sent")
                    ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
                    : "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200"
              }`}
            >
              <div className="inline-flex items-center gap-2">
                {message.includes("Error") ? (
                  <XCircle className="w-4 h-4" />
                ) : message.startsWith("Email sent") ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                {message}
              </div>
            </div>
          )}
          {result && !result.error && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-linear-to-br from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200/80 dark:border-zinc-700/50 p-5 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-zinc-700 dark:text-zinc-200 inline-flex items-center gap-3 mb-3 text-sm font-semibold">
                  <CloudSnow className="w-4 h-4" /> Snow Conditions
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                      result.snow
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {result.snow ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    {result.snow ? "Snow Expected" : "No Snow"}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-linear-to-br from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200/80 dark:border-zinc-700/50 p-5 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-zinc-700 dark:text-zinc-200 inline-flex items-center gap-3 mb-3 text-sm font-semibold">
                  <Thermometer className="w-4 h-4" /> Temperature
                </div>
                <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {result.lowTemp ?? "-"}°C
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
                  Low temperature reading
                </div>
              </div>

              <div className="rounded-2xl bg-linear-to-br from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200/80 dark:border-zinc-700/50 p-5 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-zinc-700 dark:text-zinc-200 inline-flex items-center gap-3 mb-3 text-sm font-semibold">
                  <Snowflake className="w-4 h-4" /> Frost Risk
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                      result.frostRisk
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                    }`}
                  >
                    {result.frostRisk ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    {result.frostRisk ? "Risk Detected" : "No Risk"}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-linear-to-br from-white to-zinc-50 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200/80 dark:border-zinc-700/50 p-5 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="text-zinc-700 dark:text-zinc-200 inline-flex items-center gap-3 mb-3 text-sm font-semibold">
                  <div className="w-4 h-4 rounded-full bg-linear-to-r from-green-500 to-emerald-500" />{" "}
                  Alert Status
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                      result.sent
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    }`}
                  >
                    {result.sent ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    {result.sent ? "Alert Sent" : "Not Sent"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
