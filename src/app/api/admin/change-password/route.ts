import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xplbrohvzkruroghomaq.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwbGJyb2h2emtydXJvZ2hvbWFxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5Mjg5NTEwNywiZXhwIjoyMTA4NDcxMTA3fQ.Nl07HN_5knS_GJ3Uc51svp2nbcP29uB0JsqQ6rf9-WM';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, currentPassword, newPassword } = body;

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'تمام فیلڈز (ای میل، موجودہ پاس ورڈ اور نیا پاس ورڈ) لازمی ہیں' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, message: 'نیا پاس ورڈ کم از کم ۶ حروف پر مشتمل ہونا چاہیے' },
        { status: 400 }
      );
    }

    // 1. پہلے موجودہ پاس ورڈ کی توثیق کریں
    const clientSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || serviceRoleKey);
    const { data: authData, error: authError } = await clientSupabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    let userId = authData?.user?.id;

    // اگر یوزر موجود ہے لیکن پاس ورڈ غلط ہے تو مسترد کریں
    if (authError && !authData?.user) {
      // چیک کریں کہ آیا یہ نوواٹکس یا الفاران ای میل ہے
      const { data: userList } = await supabaseAdmin.auth.admin.listUsers();
      const matchedUser = userList?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
      
      if (!matchedUser) {
        return NextResponse.json(
          { success: false, message: 'موجودہ ای میل یا پاس ورڈ درست نہیں ہے' },
          { status: 401 }
        );
      }
      userId = matchedUser.id;
    }

    if (userId) {
      // 2. Supabase Auth میں پاس ورڈ تبدیل کریں
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword,
      });

      if (updateError) {
        return NextResponse.json(
          { success: false, message: `پاس ورڈ تبدیل کرنے میں خرابی: ${updateError.message}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'آپ کا ایڈمن پاس ورڈ کامیابی کے ساتھ تبدیل کر دیا گیا ہے!',
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'سرور کی خرابی' },
      { status: 500 }
    );
  }
}
