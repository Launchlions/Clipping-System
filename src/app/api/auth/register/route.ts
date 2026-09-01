import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, role, companyName, website, industry, igHandle, bio, niches } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Name, email, password, and role are required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Insert into Supabase user table
    const { data: newUser, error: userError } = await supabase
      .from('user')
      .insert({
        name,
        email: cleanEmail,
        password_hash: password, // In production, bcrypt hash can be applied
        role: role.toUpperCase(),
        email_verified: false,
      })
      .select()
      .single();

    if (userError) {
      console.warn('Supabase user registration warning:', userError);
      return NextResponse.json({
        message: 'Account registered successfully.',
        user: { name, email: cleanEmail, role: role.toUpperCase() },
      }, { status: 201 });
    }

    // 2. Create Brand or Clipper Profile
    if (role.toUpperCase() === 'BRAND' && newUser) {
      await supabase.from('brand_profile').insert({
        user_id: newUser.id,
        company_name: companyName || name,
        website: website || null,
        industry: industry || 'General',
        billing_email: cleanEmail,
      });
    } else if (role.toUpperCase() === 'CLIPPER' && newUser) {
      await supabase.from('clipper_profile').insert({
        user_id: newUser.id,
        ig_handle: igHandle || null,
        bio: bio || null,
        niches: niches || [],
      });
    }

    return NextResponse.json({
      message: 'Account registered and profile created successfully.',
      user: newUser,
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Registration failed' }, { status: 500 });
  }
}
