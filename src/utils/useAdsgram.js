import { useCallback, useEffect, useRef } from 'react';

export function useAdsgram({ blockId, onReward, onError }) {
  console.log(blockId, onReward, onError)
  const AdControllerRef = useRef(undefined);

  useEffect(() => {
    AdControllerRef.current = window.Adsgram?.init({ blockId });
  }, [blockId]);

  return useCallback(async () => {
    if (AdControllerRef.current) {
      AdControllerRef.current
        .show()
        .then(() => {
          // user watch ad till the end or close it in interstitial format
          onReward();
          alert("success!")
        })
        .catch((result) => {
          console.log("error result",result)
          // user get error during playing ad
          onError?.(result);
        });
    } else {
      onError?.({
        error: true,
        done: false,
        state: 'load',
        description: 'Adsgram script not loaded',
      });
    }
  }, [onError, onReward]);
}