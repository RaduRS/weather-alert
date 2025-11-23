type WeatherAlertData = {
  locationName: string;
  lat: number;
  lon: number;
  timezone: string;
  windowLabel: string;
  recipient: string;
  lowTemp: number | null;
  hasSnow: boolean;
  hasLowTemp: boolean;
  hasBelowFreezing: boolean;
  hasFreezingPrecip: boolean;
  hasRadiativeFrost: boolean;
};

function yesNo(v: boolean) {
  return v ? "Yes" : "No";
}

export function renderWeatherAlertEmail(data: WeatherAlertData) {
  const subject = "Weather Alert: Frost or Snow Risk Tonight";
  const text = `Weather Alert\nLow Temp: ${data.lowTemp ?? "-"}°C\nSnow Expected: ${yesNo(data.hasSnow)}\nTemp ≤ 5°C: ${yesNo(data.hasLowTemp)}\nAir ≤ 0°C: ${yesNo(data.hasBelowFreezing)}\nFreezing Precip: ${yesNo(data.hasFreezingPrecip)}\nRadiative Frost: ${yesNo(data.hasRadiativeFrost)}`;
  const html = `
  <div style="background:#f6f8fb;padding:24px;color:#111;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
      <tr>
        <td style="padding:20px 24px;border-bottom:1px solid #e5e7eb">
          <div style="font-size:18px;font-weight:600;color:#111">Weather Alert</div>
          <div style="font-size:13px;color:#6b7280">Frost or Snow Risk Tonight</div>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate;border-spacing:0 8px">
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%"><span style="display:inline-flex;align-items:center;gap:8px"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#374151"></span>Low Temp</span></td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${data.lowTemp ?? "-"}°C</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%"><span style="display:inline-flex;align-items:center;gap:8px"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#3b82f6"></span>Snow Expected</span></td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasSnow)}</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%"><span style="display:inline-flex;align-items:center;gap:8px"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#ef4444"></span>Temp ≤ 5°C</span></td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasLowTemp)}</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%"><span style="display:inline-flex;align-items:center;gap:8px"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#0ea5e9"></span>Air ≤ 0°C</span></td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasBelowFreezing)}</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%"><span style="display:inline-flex;align-items:center;gap:8px"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#22c55e"></span>Freezing Precip</span></td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasFreezingPrecip)}</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%"><span style="display:inline-flex;align-items:center;gap:8px"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#a855f7"></span>Radiative Frost</span></td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasRadiativeFrost)}</strong></td>
            </tr>
          </table>
          <div style="margin-top:16px;font-size:13px;color:#6b7280">You are receiving this because your alert thresholds were met.</div>
        </td>
      </tr>
    </table>
  </div>`;
  return { subject, html, text };
}
