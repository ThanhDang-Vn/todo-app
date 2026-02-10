import { z } from 'zod';

export type SingUpFormState =
  | {
      error?: {
        firstName?: string[];
        lastName?: string[];
        email?: string[];
        password?: string[];
      };

      message?: string;
    }
  | undefined;

export type LoginFormState =
  | {
      error?: {
        email?: string[];
        password?: string[];
      };

      message?: string;
    }
  | undefined;

export type ForgotPasswordFormState =
  | {
      error?: {
        email?: string[];
      };
      message?: string;
    }
  | undefined;

export type VerifyOtpFormState =
  | {
      error?: {
        email?: string[];
        otp?: string[];
      };

      message?: string;
    }
  | undefined;

export type ResetFormState =
  | {
      error?: {
        token?: string[];
        password?: string[];
        confirmPassword?: string[];
      };

      message?: string;
    }
  | undefined;

export const SignUpFormSchema = z.object({
  firstName: z.string().min(2, { message: 'First Name must be at least 2 characters long.' }).trim(),
  lastName: z.string().min(2, { message: 'Last Name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Contain at least one special character.' })
    .trim(),
});

export const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Please enter your email' }).trim(),

  password: z.string().min(1, { message: 'Password can not be empty' }).trim(),
});

export const ForgotPasswordFormSchema = z.object({
  email: z.string().email({ message: 'Please enter your email' }).trim(),
});

export const VerifyOtpFormSchema = z.object({
  email: z.string().email({ message: 'Please enter your email' }).trim(),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const ResetPasswordFormSchema = z
  .object({
    password: z.string().min(1, { message: 'Password can not be empty' }).trim(),
    confirmPassword: z.string().min(1, { message: 'Password can not be empty' }).trim(),
    token: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
