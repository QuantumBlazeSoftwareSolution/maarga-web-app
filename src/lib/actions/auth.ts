'use server';

import { sendAdminOtpEmail } from './emails';
import { getAdminByEmail } from '../db/admin/read';
import { deleteAuthentication } from '../db/authentication/delete';
import { createAuthentication } from '../db/authentication/write';
import { getAuthentication } from '../db/authentication/read';
import { cookies } from 'next/headers';

export async function sendOtp(email: string) {
  try {
    if (!email) {
      return { success: false, message: 'Email is required' };
    }

    const admin = await getAdminByEmail(email);

    if (!admin) {
      return { success: false, message: 'Access denied' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await deleteAuthentication(admin.id);
    const auth = await createAuthentication(admin.id, otp, expiresAt);

    if (!auth) {
      return { success: false, message: 'Failed to create authentication' };
    }

    await sendAdminOtpEmail(email, otp);

    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Send OTP Error:', error);
    return { success: false, message: 'Internal server error' };
  }
}

export async function verifyOtp(email: string, otp: string) {
  try {
    if (!email || !otp) {
      return { success: false, message: 'Email and OTP are required' };
    }

    const admin = await getAdminByEmail(email);

    if (!admin) {
      return { success: false, message: 'Access denied' };
    }

    const authEntry = await getAuthentication({ adminId: admin.id, otp });

    if (!authEntry) {
      return { success: false, message: 'Invalid OTP' };
    }

    if (new Date() > new Date(authEntry.expiresAt)) {
      return { success: false, message: 'OTP has expired' };
    }

    await deleteAuthentication(admin.id);

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('admin_session', admin.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return { success: true, message: 'Login successful' };
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return { success: false, message: 'Internal server error' };
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    return { success: true };
  } catch (error) {
    console.error('Logout Error:', error);
    return { success: false, message: 'Failed to logout' };
  }
}
