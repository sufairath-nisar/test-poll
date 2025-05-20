import React, { useState } from "react";

interface PollProps {}

const fixedQuestion = "Which is your favourite frontend framework?";
const fixedOptions = [
  { id: "vue", option: "Vue", votes: 0 },
  { id: "angular", option: "Angular", votes: 0 },
  { id: "react", option: "React", votes: 0 },
];


const PollBox = ({
  pollIndex,
  options,
  selectedOption,
  hasVoted,
  showResults,
  onSelectOption,
  onVote,
  totalVotes,
}: {
  pollIndex: number;
  options: typeof fixedOptions;
  selectedOption: string | null;
  hasVoted: boolean;
  showResults: boolean;
  onSelectOption: (id: string) => void;
  onVote: () => void;
  totalVotes: number;
}) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: 12, borderRadius: 8 }}>
      <h3>{fixedQuestion}</h3>
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {options.map((opt) => {
          const percentage = (opt.votes / totalVotes) * 100;
          return (
            <li key={opt.id} style={{ marginBottom: 8 }}>
              <label style={{ display: "block", cursor: hasVoted ? "default" : "pointer" }}>
                <input
                  type="radio"
                  name={`poll-${pollIndex}`}
                  value={opt.id}
                  disabled={hasVoted}
                  checked={selectedOption === opt.id}
                  onChange={() => onSelectOption(opt.id)}
                  style={{ marginRight: 8 }}
                />
                {opt.option}
              </label>
              {showResults && (
                <>
                  <div style={{ marginLeft: 24, fontSize: 12, marginTop: 4 }}>
                    Votes: {opt.votes} ({percentage.toFixed(1)}%)
                  </div>
                  <div
                    style={{
                      backgroundColor: "#eee",
                      height: 10,
                      borderRadius: 5,
                      overflow: "hidden",
                      marginTop: 2,
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${percentage}%`,
                        backgroundColor: "#4caf50",
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                </>
              )}
            </li>
          );
        })}
      </ul>
      <div style={{ textAlign: "center", marginTop: 8 }}>
  <button
  onClick={onVote}
  disabled={!selectedOption || hasVoted}
  style={{
    backgroundColor: hasVoted ? "#ccc" : "#4caf50",
    color: hasVoted ? "#666" : "white", 
    border: "none",
    padding: "8px 16px",
    borderRadius: 4,
    cursor: !selectedOption || hasVoted ? "not-allowed" : "pointer",
    transition: "background-color 0.3s ease",
    display: "inline-block",
  }}
>
  {hasVoted ? <span style={{ color: "red" }}>Thanks for voting!</span> : "Vote"}
</button>

</div>

      {showResults && <div style={{ marginTop: 10 }}>Total Votes: {totalVotes}</div>}
    </div>
  );
};

export const PollTabs: React.FC<PollProps> = () => {
  const [pollStates, setPollStates] = useState([
    {
      options: fixedOptions.map((opt) => ({ ...opt })),
      selectedOption: null as string | null,
      hasVoted: false,
      showResults: false,
    },
    {
      options: fixedOptions.map((opt) => ({ ...opt })),
      selectedOption: null as string | null,
      hasVoted: false,
      showResults: false,
    },
    {
      options: fixedOptions.map((opt) => ({ ...opt })),
      selectedOption: null as string | null,
      hasVoted: false,
      showResults: false,
    },
  ]);

  const [activeTab, setActiveTab] = useState(0);

  const handleVote = (index: number) => {
    const poll = pollStates[index];
    if (!poll.selectedOption) return;

    const newOptions = poll.options.map((opt) =>
      opt.id === poll.selectedOption ? { ...opt, votes: opt.votes + 1 } : opt
    );

    const updatedPoll = {
      ...poll,
      options: newOptions,
      hasVoted: true,
      showResults: true,
    };

    const updatedStates = [...pollStates];
    updatedStates[index] = updatedPoll;
    setPollStates(updatedStates);
  };


//   const handleVote = async (index: number) => {
//   const poll = pollStates[index];
//   if (!poll.selectedOption) return;

//   const pollId = "poll3";
//   const token = localStorage.getItem("token"); // or from context, etc.

//   try {
//    const response = await fetch(`http://localhost:3000/api/polls/${pollId}/vote`, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`, 
//   },
//   body: JSON.stringify({
//     optionIndex: poll.options.findIndex((o) => o.id === poll.selectedOption),
//   }),
// });


//     if (!response.ok) {
//       const error = await response.json();
//       console.error("Vote error:", error);
//       return;
//     }

//     const data = await response.json();
//     console.log("Vote success:", data);

//     // Update local state if needed:
//     const newOptions = poll.options.map((opt, idx) =>
//       idx === data.tally.votedIndex ? { ...opt, votes: data.tally.votes[idx] } : opt
//     );

//     const updatedPoll = {
//       ...poll,
//       options: newOptions,
//       hasVoted: true,
//       showResults: true,
//     };

//     const updatedStates = [...pollStates];
//     updatedStates[index] = updatedPoll;
//     setPollStates(updatedStates);
//   } catch (err) {
//     console.error("Failed to vote:", err);
//   }
// };

  const handleSelectOption = (index: number, id: string) => {
    const poll = pollStates[index];
    if (poll.hasVoted) return;

    const updatedPoll = {
      ...poll,
      selectedOption: id,
      showResults: true,
    };

    const updatedStates = [...pollStates];
    updatedStates[index] = updatedPoll;
    setPollStates(updatedStates);
  };

  return (
    <div>
      {/* Tab Buttons */}
      <div style={{ display: "flex", marginBottom: 10 }}>
        {[0, 1, 2].map((tabIndex) => (
          <button
            key={tabIndex}
            onClick={() => setActiveTab(tabIndex)}
            style={{
              flex: 1,
              padding: 10,
              cursor: "pointer",
              backgroundColor: activeTab === tabIndex ? "#4caf50" : "#f0f0f0",
              color: activeTab === tabIndex ? "white" : "#333",
              border: "1px solid #ccc",
              borderBottom: activeTab === tabIndex ? "2px solid #4caf50" : "none",
              borderRadius: "6px 6px 0 0",
              fontWeight: activeTab === tabIndex ? "bold" : "normal",
              marginRight: tabIndex < 2 ? 6 : 0,
              transition: "all 0.3s ease",
            }}
          >
            Tab {tabIndex + 1}
          </button>
        ))}
      </div>

      
      <div style={{ display: "flex", gap: 20 }}>
        {pollStates.map((poll, index) => {
          const totalVotes = poll.options.reduce((acc, o) => acc + o.votes, 0) || 1;
          return (
            <div
              key={index}
              style={{
                flex: 1,
                opacity: activeTab === index ? 1 : 0.5,
                transform: activeTab === index ? "scale(1.02)" : "scale(0.98)",
                transition: "all 0.3s ease",
                border: activeTab === index ? "2px solid #4caf50" : "1px solid #ccc",
                borderRadius: 10,
                padding: 10,
                backgroundColor: "#fff",
                boxShadow: activeTab === index ? "0 4px 10px rgba(0,0,0,0.1)" : "none",
              }}
            >
              <h4 style={{ textAlign: "center", marginBottom: 10 }}>Poll {index + 1}</h4>
              <PollBox
                pollIndex={index}
                options={poll.options}
                selectedOption={poll.selectedOption}
                hasVoted={poll.hasVoted}
                showResults={poll.showResults}
                onSelectOption={(id) => handleSelectOption(index, id)}
                onVote={() => handleVote(index)}
                totalVotes={totalVotes}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
