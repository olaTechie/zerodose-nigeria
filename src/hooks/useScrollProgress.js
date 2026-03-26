import { useState, useCallback } from 'react';

export function useScrollProgress() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const onStepEnter = useCallback(({ data }) => {
    setCurrentStep(data);
  }, []);

  const onStepProgress = useCallback(({ progress: p }) => {
    setProgress(p);
  }, []);

  return { currentStep, progress, onStepEnter, onStepProgress };
}
