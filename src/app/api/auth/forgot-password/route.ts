import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email requis' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success to prevent email enumeration
  if (!user) {
    return NextResponse.json({ message: 'Si ce compte existe, un code a été envoyé.' });
  }

  // Generate a 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Delete any existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  // Store the code with 15 min expiration
  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: code,
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    },
  });

  // Send email with the code
  await sendEmail(
    email,
    'Votre code de réinitialisation - OTO STORE',
    `<div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
      <h2 style="text-align: center; color: #1a1a1a;">Réinitialisation du mot de passe</h2>
      <p style="color: #555; text-align: center;">Utilisez le code ci-dessous pour réinitialiser votre mot de passe. Ce code est valable <strong>15 minutes</strong>.</p>
      <div style="background: #f4f4f5; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;">${code}</span>
      </div>
      <p style="color: #888; font-size: 13px; text-align: center;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    </div>`
  );

  return NextResponse.json({ message: 'Si ce compte existe, un code a été envoyé.' });
}
