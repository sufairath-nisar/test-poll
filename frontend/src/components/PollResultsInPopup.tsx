import  { useEffect, useState } from 'react';
import type { Poll } from '../types';
import PollResults from './PollResults';

export default function PollResultsInPopup({ initialPoll }: { initialPoll: Poll }) {
  console.log("testing popup");
  console.log('[Popup React] MOUNT – initialPoll:', initialPoll);
  const [poll, setPoll] = useState(initialPoll);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      console.log('[Popup React] message event:', event.data);
      if (event.data?.type === 'UPDATE_POLL' && event.data.poll) {
        console.log('[Popup React] updating state with new poll:', event.data.poll);
        setPoll(event.data.poll);
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return <PollResults poll={poll} />;
}
