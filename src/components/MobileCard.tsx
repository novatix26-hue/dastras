import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MobileModel } from '@/lib/types';
import { Cpu, Battery, Camera, Smartphone, ArrowLeft } from 'lucide-react';

interface MobileCardProps {
  mobile: MobileModel;
}

export default function MobileCard({ mobile }: MobileCardProps) {
  const formattedPrice = new Intl.NumberFormat('ur-PK').format(mobile.price_pkr);
  const fallbackImage = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group">
      <div>
        {/* موبائل فوٹو */}
        <div className="relative h-48 bg-slate-50 flex items-center justify-center p-4 overflow-hidden border-b border-slate-100">
          <Image
            src={mobile.image_url || fallbackImage}
            alt={mobile.model_name}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
          {mobile.is_featured && (
            <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold font-urdu-sans px-2.5 py-1 rounded-full shadow-sm">
              نمایاں
            </span>
          )}
          <span className="absolute bottom-2 left-2 text-xs font-bold text-slate-500 bg-white/90 px-2 py-0.5 rounded border border-slate-200">
            {mobile.brand}
          </span>
        </div>

        {/* معلومات */}
        <div className="p-4 space-y-3 font-urdu-sans">
          <div>
            <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
              {mobile.model_name}
            </h3>
            <div className="text-xl font-extrabold text-emerald-600 mt-1">
              روپے {formattedPrice}
            </div>
          </div>

          {/* بنیادی اسپیکس */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
            {mobile.ram && (
              <div className="flex items-center gap-1.5 truncate">
                <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{mobile.ram} ریم</span>
              </div>
            )}
            {mobile.storage && (
              <div className="flex items-center gap-1.5 truncate">
                <Smartphone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{mobile.storage} میموری</span>
              </div>
            )}
            {mobile.camera && (
              <div className="flex items-center gap-1.5 truncate col-span-2">
                <Camera className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{mobile.camera}</span>
              </div>
            )}
            {mobile.battery && (
              <div className="flex items-center gap-1.5 truncate col-span-2">
                <Battery className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{mobile.battery}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* بٹن */}
      <div className="p-4 pt-0">
        <Link
          href={`/mobiles/${mobile.slug}`}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 text-sm font-bold font-urdu-sans transition-colors group-hover:bg-emerald-600 group-hover:text-white"
        >
          <span>مکمل تفصیلات و قیمت</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
