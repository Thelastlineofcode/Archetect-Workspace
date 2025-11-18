import { useQuery, useMutation } from '@tanstack/react-query';
import { compatibilityApi } from '@/lib/api';

export function usePairCompatibility(profile1Id?: string, profile2Id?: string) {
  return useQuery({
    queryKey: ['compatibility', 'pair', profile1Id, profile2Id],
    queryFn: () => {
      if (!profile1Id || !profile2Id) {
        throw new Error('Both profile IDs are required');
      }
      return compatibilityApi.calculatePair(profile1Id, profile2Id);
    },
    enabled: !!profile1Id && !!profile2Id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useTeamCompatibility(profileIds?: string[]) {
  return useQuery({
    queryKey: ['compatibility', 'team', profileIds],
    queryFn: () => {
      if (!profileIds || profileIds.length < 2) {
        throw new Error('At least 2 profile IDs are required');
      }
      return compatibilityApi.calculateTeam(profileIds);
    },
    enabled: !!profileIds && profileIds.length >= 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useCalculatePairCompatibility() {
  return useMutation({
    mutationFn: ({ profile1Id, profile2Id }: { profile1Id: string; profile2Id: string }) =>
      compatibilityApi.calculatePair(profile1Id, profile2Id),
  });
}

export function useCalculateTeamCompatibility() {
  return useMutation({
    mutationFn: (profileIds: string[]) =>
      compatibilityApi.calculateTeam(profileIds),
  });
}
