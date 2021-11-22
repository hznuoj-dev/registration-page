import api from '@/api';
import { useAuthToken } from '@/utils/hooks';
import { message } from 'antd';

export async function getInitialState() {
  const { getToken, signOut } = useAuthToken();
  const token = getToken();

  try {
    const { requestError, response } = await api.auth.getSessionInfo({
      token: token,
    });

    if (requestError) message.error(requestError);

    if (!response?.userMeta) {
      signOut();
    }

    return response;
  } catch (error) {
    console.log(error);
  }
}
