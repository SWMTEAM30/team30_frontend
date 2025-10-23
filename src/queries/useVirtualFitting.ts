import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { postFittingTryonCombo, getFittingStatusTaskId } from '@/api/fittingAPI';

// 가상피팅 요청을 위한 mutation hook
export const useVirtualFittingMutation = () => {
  return useMutation({
    mutationFn: async ({
      upper_product_id,
      lower_product_id,
      modelImageUrl,
    }: {
      upper_product_id: string;
      lower_product_id: string;
      modelImageUrl: string;
    }) => {
      const response = await postFittingTryonCombo(upper_product_id, lower_product_id, modelImageUrl);
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
    enabled: !!taskId,
    refetchInterval: (data) => {
      return 2000;
    },
    retry: 3,
  });
};

// 가상피팅 전체 프로세스를 관리하는 hook
interface UseVirtualFittingResult {
  startVirtualFitting: (upper_product_id: string, lower_product_id: string) => void;
  reset: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: Error | null;
  resultUrl?: string;
  taskId: string | null;
  status: 'success' | 'error' | 'pending' | 'idle';
}
export const useVirtualFitting = (): UseVirtualFittingResult => {
  const mutation = useVirtualFittingMutation();
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const statusQuery = useVirtualFittingStatus(currentTaskId, !!currentTaskId);

  // 상태 변화 로그
  console.log('🔍 useVirtualFitting 상태:', {
    currentTaskId,
    mutationPending: mutation.isPending,
    mutationError: mutation.error,
    statusQueryData: statusQuery.data,
    statusQueryError: statusQuery.error,
    statusQueryIsLoading: statusQuery.isLoading,
  });

  const startVirtualFitting = (upper_product_id: string, lower_product_id: string) => {
    console.log('🚀 startVirtualFitting 호출됨:', { upper_product_id, lower_product_id });
    // 비동기로 처리하되 결과를 기다리지 않음
    mutation.mutate(
      {
        upper_product_id,
        lower_product_id,
        modelImageUrl: '',
      },
      {
        onSuccess: (result) => {
          console.log('✅ 가상피팅 요청 성공:', result);
          console.log('📝 taskId 설정:', result?.task_id);
          setCurrentTaskId(result?.task_id || null);
        },
        onError: (error) => {
          console.error('❌ 가상피팅 요청 실패:', error);
        },
      },
    );
  };

  const reset = () => {
    setCurrentTaskId(null);
    mutation.reset();
  };

  const isLoading = mutation.isPending || (!!currentTaskId && !statusQuery.data?.download_url && !statusQuery.isError);
  const isSuccess = !!statusQuery.data?.download_url;
  const isError = mutation.isError || statusQuery.isError;
  const resultUrl = statusQuery.data?.download_url;
  const status = statusQuery.data?.download_url
    ? 'success'
    : mutation.isError || statusQuery.isError
      ? 'error'
      : mutation.isPending || !!currentTaskId
        ? 'pending'
        : 'idle';

  console.log('📊 최종 상태 계산:', {
    isLoading,
    isSuccess,
    isError,
    resultUrl,
    status,
  });

  return {
    startVirtualFitting,
    reset,
    isLoading,
    isSuccess,
    isError,
    error: (mutation.error as any) || (statusQuery.error as any),
    resultUrl,
    taskId: currentTaskId,
    status,
  };
};
