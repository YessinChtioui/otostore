import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, code, newPassword } = await req.json();

  if (!email || !code || !newPassword) {
    return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 6 caractères' }, { status: 400 });
  }

  // Find the token
  const verificationToken = await prisma.verificationToken.findFirst({
    where: {
      identifier: email,
      token: code,
    },
  });

  if (!verificationToken) {
    return NextResponse.json({ error: 'Code invalide ou expiré' }, { status: 400 });
  }

  // Check expiration
  if (new Date() > verificationToken.expires) {
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    return NextResponse.json({ error: 'Code expiré. Veuillez en demander un nouveau.' }, { status: 400 });
  }

  // Hash new password and update user
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  // Delete used token
  await prisma.verificationToken.deleteMany({ where: { identifier: email } });

  return NextResponse.json({ message: 'Mot de passe réinitialisé avec succès' });
}
