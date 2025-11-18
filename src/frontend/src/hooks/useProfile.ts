import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/lib/api';

export function useProfile(id?: string) {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      if (id) {
        return profileApi.getProfile(id);
      }
      return profileApi.getMyProfile();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useQuestionnaire() {
  return useQuery({
    queryKey: ['questionnaire'],
    queryFn: () => profileApi.getQuestionnaire(),
    staleTime: Infinity, // Questionnaire doesn't change
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (responses: { questionId: string; response: number }[]) =>
      profileApi.createProfile(responses),
    onSuccess: (data) => {
      // Invalidate and refetch profile queries
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useUpdateProfile(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (responses: { questionId: string; response: number }[]) =>
      profileApi.updateProfile(id, responses),
    onSuccess: (data) => {
      // Optimistically update the profile in cache
      queryClient.setQueryData(['profile', id], data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
