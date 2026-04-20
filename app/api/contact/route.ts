import { NextResponse } from 'next/server';

import { siteConfig } from '@/lib/site';

export const runtime = 'nodejs';

const RESEND_API_URL = 'https://api.resend.com/emails';
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_SOURCE_PATH_LENGTH = 200;

function normalizeInput(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return char;
    }
  });
}

function formatSubmittedAt(date: Date) {
  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Istanbul',
  }).format(date);
}

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const sender = process.env.CONTACT_FORM_FROM;
  const recipient = process.env.CONTACT_FORM_TO ?? siteConfig.email;

  if (!resendApiKey || !sender) {
    console.error('Contact form mail service is not configured. Missing RESEND_API_KEY or CONTACT_FORM_FROM.');
    return NextResponse.json(
      { error: 'Mail service is not configured.' },
      { status: 500 },
    );
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const name = normalizeInput(body.name);
  const email = normalizeInput(body.email);
  const message = normalizeInput(body.message);
  const sourcePath = normalizeInput(body.sourcePath) || '/';

  if (!name || !email) {
    return NextResponse.json(
      { error: 'Name and email are required.' },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: 'A valid email address is required.' },
      { status: 400 },
    );
  }

  if (
    name.length > MAX_NAME_LENGTH ||
    email.length > MAX_EMAIL_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH ||
    sourcePath.length > MAX_SOURCE_PATH_LENGTH
  ) {
    return NextResponse.json(
      { error: 'Submitted fields are too long.' },
      { status: 400 },
    );
  }

  const submittedAt = formatSubmittedAt(new Date());
  const normalizedMessage = message || 'Mesaj alanı boş bırakıldı.';
  const subject = `Yeni iletişim formu mesajı (${sourcePath})`;

  const text = [
    'Agenzion web sitesinden yeni bir iletişim formu mesajı geldi.',
    '',
    `Ad Soyad: ${name}`,
    `E-posta: ${email}`,
    `Kaynak sayfa: ${sourcePath}`,
    `Tarih: ${submittedAt}`,
    '',
    'Mesaj:',
    normalizedMessage,
  ].join('\n');

  const html = `
    <h2>Yeni iletişim formu mesajı</h2>
    <p>Agenzion web sitesinden yeni bir iletişim formu mesajı geldi.</p>
    <ul>
      <li><strong>Ad Soyad:</strong> ${escapeHtml(name)}</li>
      <li><strong>E-posta:</strong> ${escapeHtml(email)}</li>
      <li><strong>Kaynak sayfa:</strong> ${escapeHtml(sourcePath)}</li>
      <li><strong>Tarih:</strong> ${escapeHtml(submittedAt)}</li>
    </ul>
    <p><strong>Mesaj</strong></p>
    <p>${escapeHtml(normalizedMessage).replace(/\n/g, '<br />')}</p>
  `.trim();

  try {
    const resendResponse = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: email,
        subject,
        text,
        html,
      }),
    });

    if (!resendResponse.ok) {
      const errorDetails = await resendResponse.text();
      console.error('Contact form email send failed:', errorDetails);

      return NextResponse.json(
        { error: 'Unable to send email.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact form request to mail provider failed:', error);

    return NextResponse.json(
      { error: 'Unable to send email.' },
      { status: 502 },
    );
  }
}
