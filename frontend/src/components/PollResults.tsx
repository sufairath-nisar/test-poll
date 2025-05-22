interface PollOption {
  id: string;
  text: string;
}
interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  tally: Record<string, number>;
}
interface Props {
  poll: Poll;
}

export default function PollResults({ poll }: Props) {
  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">{poll.question}</h2>
      <ul>
        {poll.options.map(option => {
          const votes = poll.tally[option.id] || 0;
          return (
            <li key={option.id} className="mb-2">
              <div className="flex justify-between">
                <span>{option.text}</span>
                <span>{votes} vote{votes !== 1 ? 's' : ''}</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-4 mt-1">
                <div
                  className="bg-blue-600 h-4 rounded"
                  style={{
                    width: `${Math.min(100, votes * 10)}%`
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
