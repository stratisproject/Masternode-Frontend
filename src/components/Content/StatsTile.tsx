import React from 'react'

export interface StatsTileProps {
  title: string;
  value: string | number;
}

//import styles from './styles.module.scss'

const StatsTile: React.FC<StatsTileProps> = ({ title, value }) => {

  return (
    <div className="md:col-span-1 aos-init aos-animate" data-aos="fade-down">
      <div
        className="relative h-full bg-slate-800 rounded-3xl p-px before:absolute before:w-96 before:h-96 before:-left-48 before:-top-48 before:bg-purple-500 before:rounded-full before:opacity-0 before:pointer-events-none before:transition-opacity before:duration-500 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:hover:opacity-20 before:z-30 before:blur-[100px] after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:transition-opacity after:duration-500 after:[background:_radial-gradient(250px_circle_at_var(--mouse-x)_var(--mouse-y),theme(colors.slate.400),transparent)] after:group-hover:opacity-100 after:z-10 overflow-hidden">
        <div className="relative h-full bg-slate-900 rounded-[inherit] z-20 overflow-hidden">
          <div className="flex flex-col">
            <div
              className="absolute bottom-0 translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none -z-10 w-1/2 aspect-square"
              aria-hidden="true">
              <div className="absolute inset-0 translate-z-0 bg-slate-800 rounded-full blur-[80px]"></div>
            </div>
            <div className="flex items-center">
              <div className="Icon"></div>
              <div className="md:max-w-[480px] shrink-0 order-1 md:order-none p-6 pt-6 md:p-8">
                <div>
                  <h3 className="inline-flex text font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-200/60 via-slate-200 to-slate-200/60 pb-1">
                    {title}
                  </h3>
                  <div className="text-purple-400 text-xl text-ellipsis overflow-hidden">
                    {value}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsTile