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
  coverAdvice: string;
};

function yesNo(v: boolean) {
  return v ? "Yes" : "No";
}

export function renderWeatherAlertEmail(data: WeatherAlertData) {
  const headlineParts: string[] = [];
  if (data.hasSnow) headlineParts.push("Snow Expected");
  if (data.hasBelowFreezing || data.hasFreezingPrecip || data.hasRadiativeFrost) {
    headlineParts.push("Frost Risk");
  } else if (data.hasLowTemp) {
    headlineParts.push("Chilly Night");
  }
  const lowPart = data.lowTemp != null ? `Low ${data.lowTemp}°C` : "";
  const base = headlineParts.length ? headlineParts.join(" · ") : "Weather Check";
  const subject = lowPart ? `${base} · ${lowPart}` : base;
  const text = `Weather Alert\n${subject}\nLow Temp: ${data.lowTemp ?? "-"}°C\nSnow Expected: ${yesNo(data.hasSnow)}\nTemp ≤ 5°C: ${yesNo(data.hasLowTemp)}\nAir ≤ 0°C: ${yesNo(data.hasBelowFreezing)}\nFreezing Precip: ${yesNo(data.hasFreezingPrecip)}\nRadiative Frost: ${yesNo(data.hasRadiativeFrost)}\nCover Car?: ${data.coverAdvice}`;
  const html = `
  <div style="background:#f6f8fb;padding:24px;color:#111;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
      <tr>
        <td style="padding:20px 24px;border-bottom:1px solid #e5e7eb">
          <div style="font-size:18px;font-weight:600;color:#111">${subject}</div>
          <div style="font-size:13px;color:#6b7280">Tonight's conditions</div>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate;border-spacing:0 8px">
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%;vertical-align:middle"><table cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="padding:0;vertical-align:middle"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#374151;margin-right:8px"></span></td><td style="padding:0;vertical-align:middle;font-size:14px;color:#374151">Low Temp</td></tr></table></td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${data.lowTemp ?? "-"}°C</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%;vertical-align:middle"><table cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="padding:0;vertical-align:middle"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#3b82f6;margin-right:8px"></span></td><td style="padding:0;vertical-align:middle;font-size:14px;color:#374151">Snow Expected</td></tr></table></td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasSnow)}</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%;vertical-align:middle"><table cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="padding:0;vertical-align:middle"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#ef4444;margin-right:8px"></span></td><td style="padding:0;vertical-align:middle;font-size:14px;color:#374151">Temp ≤ 5°C</td></tr></table></td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasLowTemp)}</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%;vertical-align:middle"><table cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="padding:0;vertical-align:middle"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#0ea5e9;margin-right:8px"></span></td><td style="padding:0;vertical-align:middle;font-size:14px;color:#374151">Air ≤ 0°C</td></tr></table></td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasBelowFreezing)}</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%;vertical-align:middle"><table cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="padding:0;vertical-align:middle"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#22c55e;margin-right:8px"></span></td><td style="padding:0;vertical-align:middle;font-size:14px;color:#374151">Freezing Precip</td></tr></table></td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasFreezingPrecip)}</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%;vertical-align:middle"><table cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="padding:0;vertical-align:middle"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#a855f7;margin-right:8px"></span></td><td style="padding:0;vertical-align:middle;font-size:14px;color:#374151">Radiative Frost</td></tr></table></td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasRadiativeFrost)}</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%;vertical-align:middle"><table cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr><td style="padding:0;vertical-align:middle"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#14b8a6;margin-right:8px"></span></td><td style="padding:0;vertical-align:middle;font-size:14px;color:#374151">Cover Car?</td></tr></table></td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${data.coverAdvice}</strong></td>
            </tr>
          </table>
          <div style="margin-top:16px;font-size:13px;color:#6b7280">You are receiving this because your alert thresholds were met.</div>
        </td>
      </tr>
    </table>
  </div>`;
  return { subject, html, text };
}
