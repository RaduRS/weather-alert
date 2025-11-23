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
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%"><span style="display:inline-flex;align-items:center;gap:8px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 14.76V5a2 2 0 10-4 0v9.76a4 4 0 104 0z" stroke="#374151" stroke-width="1.5"/><path d="M10 9h4" stroke="#374151" stroke-width="1.5"/></svg>Low Temp</span></td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${data.lowTemp ?? "-"}°C</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%"><span style="display:inline-flex;align-items:center;gap:8px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v18M3 12h18M5 7l14 10M19 7L5 17" stroke="#374151" stroke-width="1.5"/></svg>Snow Expected</span></td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasSnow)}</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%"><span style="display:inline-flex;align-items:center;gap:8px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#374151" stroke-width="1.5"/><path d="M12 7v5l3 3" stroke="#374151" stroke-width="1.5"/></svg>Temp ≤ 5°C</span></td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasLowTemp)}</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%"><span style="display:inline-flex;align-items:center;gap:8px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12h12" stroke="#374151" stroke-width="1.5"/><path d="M14 10l2 2-2 2" stroke="#374151" stroke-width="1.5"/></svg>Air ≤ 0°C</span></td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasBelowFreezing)}</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%"><span style="display:inline-flex;align-items:center;gap:8px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5c3 0 6 3 6 6s-3 6-6 6-6-3-6-6 3-6 6-6z" stroke="#374151" stroke-width="1.5"/><path d="M12 8v8" stroke="#374151" stroke-width="1.5"/></svg>Freezing Precip</span></td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasFreezingPrecip)}</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%"><span style="display:inline-flex;align-items:center;gap:8px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3l3 5 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1 3-5z" stroke="#374151" stroke-width="1.5"/></svg>Radiative Frost</span></td>
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
