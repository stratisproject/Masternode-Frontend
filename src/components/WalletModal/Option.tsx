import { Connection, ConnectionType } from 'web3/connection'

interface Props {
  connection: Connection
  activate: () => void
  pendingConnectionType?: ConnectionType
}

const Option = ({ connection, activate, pendingConnectionType }: Props) => {
  return (
    <button onClick={!pendingConnectionType ? activate : undefined} className="btn-sm text-slate-300 bg-purple-400 hover:text-white transition duration-150 ease-in-out w-full group [background:linear-gradient(theme(colors.slate.900),_theme(colors.slate.900))_padding-box,_conic-gradient(theme(colors.slate.400),_theme(colors.slate.700)_25%,_theme(colors.slate.700)_75%,_theme(colors.slate.400)_100%)_border-box] relative before:absolute before:inset-0 before:bg-slate-800/30 before:rounded-full before:pointer-events-none">
      <span className="relative inline-flex items-center flex gap-2">
        {connection.getName()} <span
          className="tracking-normal text-purple-500 group-hover:translate-x-0.5 transition-transform duration-150 ease-in-out ml-1">-&gt;</span>
      </span>
    </button>
  )
}

export default Option
