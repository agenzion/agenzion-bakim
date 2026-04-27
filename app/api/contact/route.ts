import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

const DEFAULT_CONTACT_RECIPIENT = 'studio@agenzion.com';
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

function parseSmtpPort(value: string | undefined) {
  const port = Number.parseInt(value ?? '465', 10);

  return Number.isFinite(port) ? port : 465;
}

function parseSmtpSecure(value: string | undefined, port: number) {
  if (value !== undefined) {
    return value !== 'false';
  }

  return port === 465;
}

export async function POST(request: Request) {
  const smtpHost = process.env.CONTACT_SMTP_HOST;
  const smtpPort = parseSmtpPort(process.env.CONTACT_SMTP_PORT);
  const smtpUser = process.env.CONTACT_SMTP_USER;
  const smtpPass = process.env.CONTACT_SMTP_PASS;
  const smtpSecure = parseSmtpSecure(process.env.CONTACT_SMTP_SECURE, smtpPort);
  const senderName = normalizeInput(process.env.CONTACT_FORM_SENDER_NAME) || 'Agenzion Web Studio';
  const sender = smtpUser ? `${senderName} <${smtpUser}>` : undefined;
  const recipient = process.env.CONTACT_FORM_TO ?? DEFAULT_CONTACT_RECIPIENT;

  if (!smtpHost || !smtpUser || !smtpPass || !sender) {
    console.error('Contact form mail service is not configured. Missing SMTP environment variables.');
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
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: sender,
      to: recipient,
      replyTo: email,
      subject,
      text,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Contact form SMTP send failed:', error);

    return NextResponse.json(
      { error: 'Unable to send email.' },
      { status: 502 },
    );
  }
}
