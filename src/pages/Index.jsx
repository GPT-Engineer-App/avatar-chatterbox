import { useState } from 'react';
import AvatarInterviewer from '../components/AvatarInterviewer';

const Index = () => {
  const [interviewStarted, setInterviewStarted] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">AI Avatar Interviewer</h1>
      {!interviewStarted ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setInterviewStarted(true)}
        >
          Start Interview
        </button>
      ) : (
        <AvatarInterviewer />
      )}
    </div>
  );
};

export default Index;
