import axios, { AxiosInstance } from 'axios';
import { envVariables } from './config/config';

let serverService: AxiosInstance | null = null;

const getServerService = (): AxiosInstance => {
  if (!serverService) {
    if (!envVariables.beatMatchURL) {
      throw new Error('beatMatchURL is not defined in config.');
    }

    serverService = axios.create({
      baseURL: envVariables.beatMatchURL,
      headers: {
        'Content-type': 'application/json',
      },
      withCredentials: true,
    });
  }

  return serverService;
};

export const callbackRedirect = async (
  refreshToken: string,
  accessToken: string
): Promise<void> => {
  try {
    await getServerService().post('/callback', {
      refreshToken,
      accessToken,
    });
  } catch (error) {
    console.error('Error accessing server:', error);
    throw error;
  }
};
