import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const LAT = 53.016183;
const LON = -1.316992;
const TZ = "Europe/London";

export async function GET(request: Request) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&hourly=temperature_2m,snowfall,dewpoint_2m,relative_humidity_2m,cloudcover,windspeed_10m,precipitation&forecast_days=2&timezone=${encodeURIComponent(TZ)}`;
    const response = await fetch(url, { cache: "no-store" });
    const weather = await response.json();

    const times: string[] = weather?.hourly?.time ?? [];
    const temps: number[] = weather?.hourly?.temperature_2m ?? [];
    const snow: number[] = weather?.hourly?.snowfall ?? [];
    const dew: number[] = weather?.hourly?.dewpoint_2m ?? [];
    const rh: number[] = weather?.hourly?.relative_humidity_2m ?? [];
    const clouds: number[] = weather?.hourly?.cloudcover ?? [];
    const wind: number[] = weather?.hourly?.windspeed_10m ?? [];
    const precip: number[] = weather?.hourly?.precipitation ?? [];

    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
    const y = parts.find((p) => p.type === "year")?.value ?? "1970";
    const m = parts.find((p) => p.type === "month")?.value ?? "01";
    const d = parts.find((p) => p.type === "day")?.value ?? "01";
    const todayISO = `${y}-${m}-${d}`;
    const tomorrowUTC = new Date(
      Date.UTC(Number(y), Number(m) - 1, Number(d) + 1)
    );
    const tomorrowISO = `${tomorrowUTC.getUTCFullYear()}-${String(tomorrowUTC.getUTCMonth() + 1).padStart(2, "0")}-${String(tomorrowUTC.getUTCDate()).padStart(2, "0")}`;

    const nightHours = new Set([20, 21, 22, 23]);
    const morningHours = new Set([0, 1, 2, 3, 4, 5, 6]);

    const indices: number[] = [];
    for (let i = 0; i < times.length; i++) {
      const t = times[i];
      const date = t.slice(0, 10);
      const hour = Number(t.slice(11, 13));
      if (
        (date === todayISO && nightHours.has(hour)) ||
        (date === tomorrowISO && morningHours.has(hour))
      ) {
        indices.push(i);
      }
    }

    const selTemps = indices
      .map((i) => temps[i])
      .filter((v) => typeof v === "number");
    const selSnow = indices
      .map((i) => snow[i])
      .filter((v) => typeof v === "number");

    const hasSnow = selSnow.some((s) => s > 0);
    const hasLowTemp = selTemps.some((t) => t <= 5);
    const hasBelowFreezing = selTemps.some((t) => t <= 0);
    const hasFreezingPrecip = indices.some((i) => {
      const t = temps[i];
      const p = precip[i] ?? 0;
      const s = snow[i] ?? 0;
      return t <= 0.5 && p > 0 && s === 0;
    });
    const hasRadiativeFrost = indices.some((i) => {
      const t = temps[i];
      const dp = dew[i];
      const h = rh[i] ?? 0;
      const cc = clouds[i] ?? 100;
      const w = wind[i] ?? 10;
      return t <= 2 && dp <= 2 && h >= 85 && cc <= 40 && w <= 4;
    });
    const frostRisk =
      hasSnow || hasBelowFreezing || hasFreezingPrecip || hasRadiativeFrost;
    const lowTemp = selTemps.length ? Math.min(...selTemps) : null;

    const urlObj = new URL(request.url);
    const forceParam = urlObj.searchParams.get("force");
    const force = forceParam === "1" || forceParam === "true";
    const shouldSend = force || hasSnow || hasLowTemp || frostRisk;

    if (shouldSend) {
      const toAddress = process.env.EMAIL_ADDRESS;
      if (!toAddress) {
        return Response.json(
          { error: "EMAIL_ADDRESS not configured" },
          { status: 500 }
        );
      }
      await resend.emails.send({
        from: "Weather Alert <onboarding@resend.dev>",
        to: [toAddress],
        subject: "⚠️ Weather Alert: Frost/Snow Risk Tonight",
        html: `<strong>Alert!</strong><br/>${hasSnow ? "🌨️ Snow expected tonight<br/>" : ""}${hasLowTemp ? `🥶 Temperature at or below 5°C${lowTemp !== null ? ` (low: ${lowTemp}°C)` : ""}<br/>` : ""}${hasBelowFreezing ? "🧊 Air temperature at/under 0°C<br/>" : ""}${hasFreezingPrecip ? "🌧️ Precipitation near freezing (possible ice)<br/>" : ""}${hasRadiativeFrost ? "❄️ Frost risk with clear/calm, humid conditions<br/>" : ""}`,
      });
    }

    return Response.json({
      checked: true,
      snow: hasSnow,
      lowTemp,
      frostRisk,
      sent: shouldSend,
    });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
