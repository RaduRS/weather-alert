const LAT = 53.016183;
const LON = -1.316992;
const TZ = "Europe/London";

type PrecipItem = {
  time: string;
  precip: number;
  prob: number; // 0-100 precipitation probability
};

export async function GET() {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&hourly=precipitation,precipitation_probability&forecast_days=2&timezone=${encodeURIComponent(TZ)}`;
    const response = await fetch(url, { cache: "no-store" });
    const weather = await response.json();

    const times: string[] = weather?.hourly?.time ?? [];
    const precip: number[] = weather?.hourly?.precipitation ?? [];
    const probs: number[] = weather?.hourly?.precipitation_probability ?? [];

    const now = new Date();
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    }).formatToParts(now);
    const y = fmt.find((p) => p.type === "year")?.value ?? "1970";
    const m = fmt.find((p) => p.type === "month")?.value ?? "01";
    const d = fmt.find((p) => p.type === "day")?.value ?? "01";
    const h = fmt.find((p) => p.type === "hour")?.value ?? "00";
    const key = `${y}-${m}-${d}T${h}:00`;

    const startIndex = Math.max(0, times.indexOf(key));
    const endIndex = Math.min(times.length, startIndex + 24);

    const slicePrecip = precip
      .slice(startIndex, endIndex)
      .map((v) => (typeof v === "number" ? v : 0));
    const maxPrecip = Math.max(...slicePrecip, 0.001);

    const items: PrecipItem[] = [];
    for (let i = startIndex; i < endIndex; i++) {
      const mm = precip[i] ?? 0;
      const probRaw = probs[i];
      const prob =
        typeof probRaw === "number"
          ? probRaw
          : Math.min(100, Math.round(((mm || 0) / maxPrecip) * 100));
      items.push({ time: times[i], precip: mm || 0, prob });
    }

    return Response.json({ items });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
