'use client';

import { useEffect } from 'react';
import { onCLS, onINP, onLCP, onFCP, onTTFB, Metric } from 'web-vitals';

// 이 함수는 window.gtag가 이미 로드되었다고 가정하고 이벤트를 보냅니다.
function sendToGoogleAnalytics({ name, delta, value, id }: Metric) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, {
      value: delta,
      metric_id: id,
      metric_value: value,
      metric_delta: delta,
    });
  }
}

export default function WebVitals() {
  // 이 컴포넌트는 이제 web-vitals 측정 및 전송 로직만 담당합니다.
  useEffect(() => {
    onCLS(sendToGoogleAnalytics);
    onINP(sendToGoogleAnalytics);
    onLCP(sendToGoogleAnalytics);
    onFCP(sendToGoogleAnalytics);
    onTTFB(sendToGoogleAnalytics);
  }, []);

  return null; // 이 컴포넌트는 화면에 아무것도 렌더링하지 않습니다.
}
