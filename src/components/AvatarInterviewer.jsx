import { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';

const AvatarInterviewer = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [intervieweeAnswer, setIntervieweeAnswer] = useState('');
  const webrtcConnectionRef = useRef(null);
  const dataChannelRef = useRef(null);

  const interviewQuestions = [
    "Tell me about your experience with JavaScript.",
    "How do you handle asynchronous operations in your code?",
    "What's your approach to debugging complex issues?",
    "Can you explain the concept of closures in JavaScript?",
    "How do you stay updated with the latest web development trends?"
  ];

  useEffect(() => {
    if (isCallActive) {
      initializeCall();
    }
    return () => {
      if (webrtcConnectionRef.current) {
        webrtcConnectionRef.current.close();
      }
    };
  }, [isCallActive]);

  const initializeCall = () => {
    webrtcConnectionRef.current = new RTCPeerConnection();

    webrtcConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("New ICE candidate:", event.candidate);
      }
    };

    dataChannelRef.current = webrtcConnectionRef.current.createDataChannel("interview");
    dataChannelRef.current.onopen = handleDataChannelOpen;
    dataChannelRef.current.onmessage = handleDataChannelMessage;

    webrtcConnectionRef.current.createOffer()
      .then(offer => webrtcConnectionRef.current.setLocalDescription(offer))
      .then(() => {
        console.log("Offer created and set as local description");
      })
      .catch(error => console.error("Error creating offer:", error));
  };

  const handleDataChannelOpen = () => {
    console.log("Data channel opened. Starting interview...");
    askNextQuestion();
  };

  const handleDataChannelMessage = (event) => {
    console.log("Received message:", event.data);
    setIntervieweeAnswer(event.data);
  };

  const askNextQuestion = () => {
    if (interviewQuestions.length > 0) {
      const question = interviewQuestions.shift();
      setCurrentQuestion(question);
      if (dataChannelRef.current) {
        dataChannelRef.current.send(question);
      }
    } else {
      endInterview();
    }
  };

  const endInterview = () => {
    setIsCallActive(false);
    setCurrentQuestion("Thank you for participating in the interview. We'll be in touch soon.");
    if (dataChannelRef.current) {
      dataChannelRef.current.send("Interview completed.");
    }
  };

  const handleStartInterview = () => {
    setIsCallActive(true);
  };

  const handleSubmitAnswer = () => {
    if (intervieweeAnswer.trim() !== '') {
      console.log("Answer submitted:", intervieweeAnswer);
      setIntervieweeAnswer('');
      askNextQuestion();
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4">
      <div className="w-full aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
        <Camera className="h-16 w-16 text-gray-400" />
      </div>
      <div className="w-full bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 className="text-xl font-semibold mb-2">Current Question:</h2>
        <p className="text-lg">{currentQuestion}</p>
      </div>
      <textarea
        className="w-full p-2 border rounded-md mb-4"
        rows="4"
        placeholder="Type your answer here..."
        value={intervieweeAnswer}
        onChange={(e) => setIntervieweeAnswer(e.target.value)}
      ></textarea>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={isCallActive ? handleSubmitAnswer : handleStartInterview}
      >
        {isCallActive ? 'Submit Answer' : 'Start Interview'}
      </button>
    </div>
  );
};

export default AvatarInterviewer;
