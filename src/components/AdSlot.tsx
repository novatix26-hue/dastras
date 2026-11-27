'use client';

import React, { useEffect } from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  layoutKey?: string;
  className?: string;
  label?: boolean;
}

export default function AdSlot({
  slotId = '1234567890',
  format = 'auto',
  layoutKey,
  className = '',
  label = true,
}: AdSlotProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXX';

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      // AdSense already initialized or blocked by ad blocker
    }
  }, []);

  return (
    <div className={`my-6 text-center overflow-hidden ${className}`}>
      {label && (
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-urdu-sans mb-1 select-none">
          اشتہار • باقاعدہ تصدیق شدہ
        </div>
      )}
      <div className="min-h-[100px] w-full flex items-center justify-center bg-slate-100/70 border border-dashed border-slate-200 rounded-2xl p-2 overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
          {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        />
      </div>
    </div>
  );
}
