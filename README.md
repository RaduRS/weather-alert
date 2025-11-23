What we're building: A simple weather alert app that automatically sends an email every evening if it's going to snow or drop below 5°C overnight.

Tech stack:

Next.js app deployed to Vercel (free Hobby plan)

Open-Meteo API for weather data (completely free, no API key needed)

Resend for sending emails (3,000 free emails/month)

Vercel Cron Jobs to check weather daily around 7pm UTC (free on Hobby plan)

How it works:

Vercel cron job triggers once daily between 7:00pm-7:59pm UTC (imprecise timing on free plan)

Checks Open-Meteo API for tonight's temperature and snowfall

If snow or temp below 5°C detected, sends email alert via Resend

Zero ongoing costs - completely free to run

Files needed:

vercel.json - defines the cron schedule ("0 19 * * *" = 7pm UTC daily)

/app/api/weather-alert/route.ts - API endpoint that checks weather and sends email

.env.local - stores Resend API key

Limitations on free plan: 2 cron jobs max, once-per-day scheduling, imprecise timing (runs anywhere within the hour specified).



posible code spinnets

{
  "crons": [
    {
      "path": "/api/weather-alert",
      "schedule": "0 19 * * *"
    }
  ]
}



api import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  try {
    // Fetch tonight's weather (Open-Meteo API - no key needed)
    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&hourly=temperature_2m,snowfall&forecast_days=1&timezone=Europe/London'
    );
    const weather = await response.json();
    
    // Check tonight's hours (e.g., 20:00 to 06:00)
    const tonight = weather.hourly.temperature_2m.slice(20, 30);
    const snowfall = weather.hourly.snowfall.slice(20, 30);
    
    const hasSnow = snowfall.some((s: number) => s > 0);
    const hasLowTemp = tonight.some((t: number) => t < 5);
    
    if (hasSnow || hasLowTemp) {
      await resend.emails.send({
        from: 'Weather Alert <onboarding@resend.dev>',
        to: ['rsrusu90@gmail.com'],
        subject: '⚠️ Weather Alert: Cold/Snow Tonight',
        html: `<strong>Alert!</strong><br/>
               ${hasSnow ? '🌨️ Snow expected tonight<br/>' : ''}
               ${hasLowTemp ? `🥶 Temperature dropping below 5°C (low: ${Math.min(...tonight)}°C)` : ''}`
      });
    }
    
    return Response.json({ checked: true });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
