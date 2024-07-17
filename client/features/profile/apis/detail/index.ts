import { useQuery } from '@tanstack/vue-query';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import type { IProfile } from '../../models';
import { useProfileUpdateUidMutation } from '../update-uid';
import { requestApi } from '~/common/libs/request-api';
import type { IResponseApi } from '~/common/models';
import { allQueriesKeys, type QueryConfig } from '~/queries';
import { firebaseAuth } from '~/firebase';

function profileDetailQuery() {
  return requestApi<any, IResponseApi<IProfile>>({
    method: 'GET',
    url: 'profile',
  });
}

interface UseGetAllUsersQueryProps {
  configs?: QueryConfig<typeof profileDetailQuery>;
}

export function useQueryProfile(props: UseGetAllUsersQueryProps = {}) {
  const { configs } = props;
  const { mutate } = useProfileUpdateUidMutation();

  const query = useQuery({
    queryKey: allQueriesKeys.profile.detail.queryKey,
    queryFn: () => profileDetailQuery(),

    ...configs,
  });

  watch(query.data, async (v) => {
    const email = v?.data.email;
    if (email) {
      const user = firebaseAuth.currentUser;

      if (!user) {
        // login

        try {
          const newUser = await signInWithEmailAndPassword(firebaseAuth, email, '12345678');

          if (newUser.user.uid && newUser.user.uid !== v?.data.uid) {
            mutate({ body: { uid: newUser.user.uid } });
          }
        } catch (error) {
          const registerUser = await createUserWithEmailAndPassword(
            firebaseAuth,
            email,
            '12345678'
          );

          if (registerUser.user.uid && registerUser.user.uid !== v?.data.uid) {
            mutate({ body: { uid: registerUser.user.uid } });
          }
        }
      }

      // save token firebase

      const uid = user?.uid;

      if (uid && uid !== v.data.uid) {
        mutate({ body: { uid } });
      }
    }
  });

  return query;
}
