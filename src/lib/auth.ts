'use server';

import { redirect } from 'next/navigation';
import { BACKEND_URL } from './constant';
import { FormState, LoginFormSchema, SignUpFormSchema } from './type';
import { createSession } from './session';

export async function SignUpForm(state: FormState, formData: FormData): Promise<FormState> {
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

  console.log(validateFormField.data);

  if (response.ok) {
    redirect('/auth/login');
  } else {
    return {
      message: response.status === 409 ? 'The user is already existed' : response.statusText,
    };
  }
}

export async function loginForm(state: FormState, formData: FormData): Promise<FormState> {
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
    });

    console.log({
      result,
    });

    redirect('/inbox');
  } else {
    return {
      message: response.status === 401 ? 'User not exist or password not match' : response.statusText,
    };
  }
}
