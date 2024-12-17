import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../../../constant";

const Coding = ({ campusId }) => {
  const [code, setCode] = useState([]);

  useEffect(() => {
    const fetchQuestion = async () => {
      const token =  localStorage.getItem("token");
		console.log(token)
      try {
        const response = await axios.get(`${BACKEND_URL}/pyq/code?campusId=${campusId}`, {
          headers: {
            Authorization: token,
          },
        });

        if (response.status === 200) {
          setCode(response.data.codingQuestions);
        }
      } catch (error) {
        console.error("Error fetching coding questions:", error);
      }
    };

    fetchQuestion();
  }, [campusId]);

  if (!code || code.length === 0) {
    return <div>No coding problems found.</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">- Coding Problems</h2>
      {code.map((problem) => (
        <div key={problem.id} className="mb-6 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold">Problem {problem.Question}</h3>
          <p className="mt-2">
            <strong>Inputs:</strong> {problem.SampleInput}
          </p>
          <p>
            <strong>Outputs:</strong> {problem.SampleOutput}
          </p>
          <pre className="bg-gray-800 text-white p-4 rounded mt-4">
            <code>{problem.Code}</code>
          </pre>
          <p>
            <strong>Explanation:</strong> {problem.Explanation}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Coding;
