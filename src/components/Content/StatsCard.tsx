import React from 'react'

export interface StatsCardProps {
    icon: React.ReactElement;
    title: string;
    value: string | number;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value }) => {
  return (
    <div className="flex items-center justify-start gap-3 pointer-events-auto w-[18rem] rounded-lg bg-white p-4 text-[0.8125rem] leading-5 shadow-xl shadow-black/5 hover:bg-slate-50 ring-1 ring-slate-700/10">
      {icon}
      <div>
        <div>{title}</div>
        <div className="text-lg text-purple-800 font-bold font-size-14">{value}</div>
      </div>
    </div>
  )
}

export default StatsCard