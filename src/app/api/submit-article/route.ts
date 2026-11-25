import { NextResponse } from 'next/server';
import { submitArticle } from '@/lib/supabaseClient';
import { generateSlug } from '@/lib/utils';
import { ArticleCategory } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, author_name, category, image_url, summary, content } = body;

    if (!title || !author_name || !content) {
      return NextResponse.json(
        { success: false, message: 'عنوان، مصنف کا نام اور مواد لازمی ہیں۔' },
        { status: 400 }
      );
    }

    const slug = generateSlug(title);
    const result = await submitArticle({
      title: title.trim(),
      slug,
      author_name: author_name.trim(),
      category: (category as ArticleCategory) || 'خصوصی مضامین',
      image_url: image_url || null,
      summary: summary || null,
      content: content.trim(),
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('API submit error:', err);
    return NextResponse.json(
      { success: false, message: 'مضمون وصول کرنے میں سرور پر خرابی واقع ہوئی۔' },
      { status: 500 }
    );
  }
}
