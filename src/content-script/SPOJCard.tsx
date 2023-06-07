import { SearchIcon } from '@primer/octicons-react'
import { useState } from 'preact/hooks'
import { TriggerMode } from '../config'
import SPOJQuery, { QueryStatus } from './SPOJQuery'

interface Props {
  problem_ids: any
  promptSource: string
  triggerMode: TriggerMode
  onStatusChange?: (status: QueryStatus) => void
}

function SPOJCard(props: Props) {
  const [triggered, setTriggered] = useState(false)

  if (props.triggerMode === TriggerMode.Always) {
    return <SPOJQuery {...props} />
  }
  if (triggered) {
    return <SPOJQuery {...props} />
  }
  return (
    <p className="icon-and-text cursor-pointer" onClick={() => setTriggered(true)}>
    </p>
  )
}

export default SPOJCard
