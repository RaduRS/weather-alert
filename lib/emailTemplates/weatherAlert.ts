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
  const text = `Weather Alert\nLocation: ${data.locationName} (${data.lat}, ${data.lon})\nWindow: ${data.windowLabel} (${data.timezone})\nLow Temp: ${data.lowTemp ?? "-"}°C\nSnow Expected: ${yesNo(data.hasSnow)}\nTemp ≤ 5°C: ${yesNo(data.hasLowTemp)}\nAir ≤ 0°C: ${yesNo(data.hasBelowFreezing)}\nFreezing Precip: ${yesNo(data.hasFreezingPrecip)}\nRadiative Frost: ${yesNo(data.hasRadiativeFrost)}\nRecipient: ${data.recipient}`;
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
          <div style="margin-bottom:12px;font-size:14px;color:#374151">Location: <strong>${data.locationName}</strong> (${data.lat}, ${data.lon})</div>
          <div style="margin-bottom:12px;font-size:14px;color:#374151">Window: <strong>${data.windowLabel}</strong> (${data.timezone})</div>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate;border-spacing:0 8px">
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%">Low Temp</td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${data.lowTemp ?? "-"}°C</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%">Snow Expected</td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasSnow)}</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%">Temp ≤ 5°C</td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasLowTemp)}</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%">Air ≤ 0°C</td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasBelowFreezing)}</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%">Freezing Precip</td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasFreezingPrecip)}</strong></td>
            </tr>
            <tr>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px;width:50%">Radiative Frost</td>
              <td style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:12px 14px"><strong>${yesNo(data.hasRadiativeFrost)}</strong></td>
            </tr>
          </table>
          <div style="margin-top:16px;font-size:13px;color:#6b7280">You are receiving this because your alert thresholds were met.</div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px;border-top:1px solid #e5e7eb">
          <div style="font-size:12px;color:#9ca3af">Recipient: ${data.recipient}</div>
        </td>
      </tr>
    </table>
  </div>`;
  return { subject, html, text };
}

