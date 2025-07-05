'use server';

import { IAttributes } from 'oneentry/dist/base/utils';
import { fetchApiClient } from '@/lib/oneentry';
import { ISignUpData } from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import { isErrorWithMessage } from '@/lib/utils';

export const getSignupFormData = async (): Promise<IAttributes[]> => {
  try {
    const apiClient = await fetchApiClient();

    const response = await apiClient?.Forms.getFormByMarker('sign_up', 'en_US');

    return response?.attributes as unknown as IAttributes[];
  } catch (error: unknown) {
    if (isErrorWithMessage(error)) {
      console.error('Signup form fetch error:', error.message);
    } else {
      console.error('Unknown error while fetching signup form:', error);
    }

    throw new Error('Fetching form data failed.');
  }
};

export const handleSignupSubmit = async (inputValues: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const apiClient = await fetchApiClient();

    const data: ISignUpData = {
      formIdentifier: 'sign_up',
      authData: [
        { marker: 'email', value: inputValues.email },
        { marker: 'password', value: inputValues.password },
      ],
      formData: [
        { marker: 'name', type: 'string', value: inputValues.name },
      ],
      notificationData: {
        email: inputValues.email,
        phonePush: ['+1234567890'],
        phoneSMS: '+1234567890',
      },
    };

    const value = await apiClient?.AuthProvider.signUp('email', data);

    return value;
  } catch (error: unknown) {
    if (isErrorWithMessage(error) && error.statusCode === 400) {
      return { message: error.message };
    }

    console.error('Signup error:', error);
    throw new Error('Account Creation Failed. Please try again later.');
  }
};
