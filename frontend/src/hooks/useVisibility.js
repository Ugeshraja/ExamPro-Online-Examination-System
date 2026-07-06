import { useState, useEffect } from 'react';

export const useVisibility = (onTabSwitchViolation) => {
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          const nextCount = prev + 1;
          if (onTabSwitchViolation) {
            onTabSwitchViolation('tab-switch', nextCount);
          }
          return nextCount;
        });
      }
    };

    const handleWindowBlur = () => {
      setTabSwitchCount((prev) => {
        const nextCount = prev + 1;
        if (onTabSwitchViolation) {
          onTabSwitchViolation('window-blur', nextCount);
        }
        return nextCount;
      });
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [onTabSwitchViolation]);

  return { tabSwitchCount, setTabSwitchCount };
};
