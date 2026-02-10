'use server';

import { redirect } from 'next/navigation';
import { BACKEND_URL } from './constant';
import {
  ForgotPasswordFormSchema,
  ForgotPasswordFormState,
  LoginFormSchema,
  LoginFormState,
  SignUpFormSchema,
  SingUpFormState,
  VerifyOtpFormSchema,
  VerifyOtpFormState,
} from './validateType';
import { createSession } from './session';
import { email } from 'zod';

export async function SignUpForm(state: SingUpFormState, formData: FormData): Promise<SingUpFormState> {
  const validateFormField = SignUpFormSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validateFormField.success) {
    return {
      error: validateFormField.error.flatten().fieldErrors,
    };
  }

  const response = await fetch(`${BACKEND_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(validateFormField.data),
  });

  if (response.ok) {
    redirect('/auth/login');
  } else {
    return {
      message: response.status === 409 ? 'The user is already existed' : response.statusText,
    };
  }
}

export async function loginForm(state: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const validateFormData = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validateFormData.success) {
    return {
      error: validateFormData.error.flatten().fieldErrors,
    };
  }

  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(validateFormData.data),
  });

  if (response.ok) {
    const result = await response.json();

    await createSession({
      user: {
        id: result.id,
        name: result.name,
        email: result.email,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });

    redirect('/inbox');
  } else {
    return {
      message: response.status === 401 ? 'User not exist or password not match' : response.statusText,
    };
  }
}

export async function refreshToken(oldRefreshToken: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: 'POST',
      body: JSON.stringify({
        refreshToken: oldRefreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const { accessToken, refreshToken } = await response.json();

    // update session with new token

    const updateRes = await fetch(`http://localhost:3000/api/auth/update`, {
      method: 'POST',
      body: JSON.stringify({
        accessToken: accessToken,
        refreshToken: refreshToken,
      }),
    });

    if (!updateRes.ok) throw new Error('failed to update token');

    return accessToken;
  } catch (error) {
    console.error('Failed to refresh token: ', error);
  }
}

export async function forgotPasswordForm(
  state: ForgotPasswordFormState,
  formData: FormData,
): Promise<ForgotPasswordFormState> {
  const email = formData.get('email') as string;
  const validateFormData = ForgotPasswordFormSchema.safeParse({
    email: email,
  });

  if (!validateFormData.success) {
    return {
      error: validateFormData.error.flatten().fieldErrors,
    };
  }

  const response = await fetch(`${BACKEND_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(validateFormData.data),
  });

  if (response.ok) {
    redirect(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
  } else {
    return {
      message: response.status === 401 ? 'User not exist or password not match' : response.statusText,
    };
  }
}

export async function verifyOtpForm(state: VerifyOtpFormState, formData: FormData): Promise<VerifyOtpFormState> {
  const validateFormData = VerifyOtpFormSchema.safeParse({
    email: formData.get('email'),
    otp: formData.get('otp'),
  });

  if (!validateFormData.success) {
    return {
      error: validateFormData.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(validateFormData.data),
    });

    if (response.ok) {
      const data = await response.json();
      redirect(`/auth/reset-password?token=${data.token}`);
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}
