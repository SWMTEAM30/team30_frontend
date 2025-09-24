import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { postFittingTryonCombo, getFittingStatusTaskId } from '@/api/fittingAPI';

// 가상피팅 요청을 위한 mutation hook
export const useVirtualFittingMutation = () => {
  return useMutation({
    mutationFn: async ({ userImageUrl, clothImageUrls }: { userImageUrl: string; clothImageUrls: string[] }) => {
      const response = await postFittingTryonCombo(userImageUrl, clothImageUrls);
      if (response.status === 'fail') {
        throw new Error(response.message);
      }
      return response.data;
    },
    onError: (error) => {
      console.error('가상피팅 요청 실패:', error);
    },
  });
};

// 가상피팅 상태 확인을 위한 query hook
export const useVirtualFittingStatus = (taskId: string | null, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['virtualFittingStatus', taskId],
    queryFn: async () => {
      if (!taskId) throw new Error('Task ID is required');
      const response = await getFittingStatusTaskId(taskId);
      if (response.status === 'fail') {
        throw new Error(response.message);
      }
      return response.data;
    },
    enabled: enabled && !!taskId,
    refetchInterval: (data) => {
      // 성공하거나 실패하면 폴링 중단
      if (data?.success === true || data?.success === false) {
        return false;
      }
      // 진행 중이면 2초마다 폴링
      return 2000;
    },
    retry: 3,
  });
};

// 가상피팅 전체 프로세스를 관리하는 hook
export const useVirtualFitting = () => {
  const mutation = useVirtualFittingMutation();
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  
  const statusQuery = useVirtualFittingStatus(
    currentTaskId, 
    mutation.isSuccess && !!currentTaskId
  );

  const startVirtualFitting = async (userImageUrl: string, clothImageUrls: string[]) => {
    try {
      const result = await mutation.mutateAsync({ userImageUrl, clothImageUrls });
      setCurrentTaskId(result.taskId);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const reset = () => {
    setCurrentTaskId(null);
    mutation.reset();
    statusQuery.remove();
  };

  return {
    startVirtualFitting,
    reset,
    isLoading: mutation.isPending,
    isSuccess: statusQuery.isSuccess && statusQuery.data?.success,
    isError: mutation.isError || (statusQuery.isError),
    error: mutation.error || statusQuery.error,
    resultUrl: statusQuery.data?.downloadUrl,
    taskId: currentTaskId,
    status: statusQuery.data?.success ? 'success' : 
            mutation.isError || statusQuery.isError ? 'error' :
            mutation.isPending ? 'pending' : 'idle',
  };
};
