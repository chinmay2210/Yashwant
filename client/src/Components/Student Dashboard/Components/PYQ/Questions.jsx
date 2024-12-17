import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../../../constant";

const Questions = ({ campusId, campusName }) => {
  const [showAnswers, setShowAnswers] = useState({});
  const [questions, setQuestions] = useState([]);

  const toggleAnswer = (questionId) => {
    setShowAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  useEffect(() => {
    const fetchQuestion = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(`${BACKEND_URL}/pyq/interview?campusID=${campusId}`, {
          headers: {
            Authorization: token,
          },
        });

        if (response.status === 200) {
          console.log(response.data.data); // Ensure this matches the structure returned by the API
          setQuestions(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching interview questions:", error);
      }
    };

    fetchQuestion();
  }, [campusId]);

  if (!questions || questions.length === 0) {
    return <div>No interview questions found.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{campusName} - Interview Questions</h2>
      {questions.map((question) => (
        <div key={question.CodeID} className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold">Question {question.CodeID}</h3>
          <p className="mt-2">
            <strong>Question:</strong> {question.Question}
          </p>
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => toggleAnswer(question.CodeID)}
          >
            {showAnswers[question.CodeID] ? "Hide Answer" : "Show Answer"}
          </button>
          {showAnswers[question.CodeID] && (
            <p className="mt-2 text-green-600">
              <strong>Answer:</strong> {question.Answer || "No answer provided"}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Questions;
