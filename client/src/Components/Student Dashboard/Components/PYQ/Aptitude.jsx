import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../../../constant";

const Aptitude = ({ campusId,  }) => {
  const [showAnswers, setShowAnswers] = useState({});
  const [code, setCode] = useState([]);

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
        const response = await axios.get(`${BACKEND_URL}/pyq/apti?campusId=${campusId}`, {
          headers: {
            Authorization: token,
          },
        });

        if (response.status === 200) {
			console.log(response.data.aptiLRQuestions)
          setCode(response.data.aptiLRQuestions
			);
        }
      } catch (error) {
        console.error("Error fetching coding questions:", error);
      }
    };

    fetchQuestion();
  }, [campusId]);

  if (!code || code.length === 0) {
    return <div>No Aptitude problems found.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{} - Aptitude Questions</h2>
      {code.map((question) => (
        <div key={question.AptiLRID} className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold">
            Question {question.Question}
          </h3>
          <ul className="mt-2 ml-4 list-disc">
          {question.Option1}
          </ul>
		  <ul className="mt-2 ml-4 list-disc">
          {question.Option2}
          </ul>
		  <ul className="mt-2 ml-4 list-disc">
          {question.Option3}
          </ul>
		  <ul className="mt-2 ml-4 list-disc">
          {question.Option4}
          </ul>
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => toggleAnswer(question.AptiLRID)}
          >
            {showAnswers[question.AptiLRID] ? "Hide Answer" : "Show Answer"}
          </button>
          {showAnswers[question.AptiLRID] && (
            <p className="mt-2 text-green-600">
              <strong>Correct Answer:</strong> {question.Answer}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Aptitude;
