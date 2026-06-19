import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return 200 even if user doesn't exist to prevent email enumeration
      return NextResponse.json({ message: 'If an account exists, an email was sent.' });
    }

    // Generate a random token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600 * 1000); // 1 hour from now

    // Save token to database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send email
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    
    await sendEmail(
      email,
      'Réinitialisation de votre mot de passe - OTO STORE',
      `
      <h2>Réinitialisation de mot de passe</h2>
      <p>Bonjour ${user.name || ''},</p>
      <p>Vous avez demandé à réinitialiser votre mot de passe sur OTO STORE.</p>
      <p>Veuillez cliquer sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #f97316; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px;">Réinitialiser mon mot de passe</a>
      <p style="margin-top: 20px; font-size: 12px; color: #666;">Ce lien expirera dans 1 heure. Si vous n'avez pas fait cette demande, vous pouvez ignorer cet email.</p>
      `
    );

    return NextResponse.json({ message: 'If an account exists, an email was sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
