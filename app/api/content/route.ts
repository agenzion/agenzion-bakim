import { NextResponse } from 'next/server';
import { getDb, saveDb, AppData } from '@/lib/db';
import { getPublicContent } from '@/lib/content';
import { isLocale } from '@/lib/i18n';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale');
    const data =
      locale && isLocale(locale) ? await getPublicContent(locale) : await getDb();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newData: AppData = await request.json();
    await saveDb(newData);
    return NextResponse.json({ message: 'Data saved successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
