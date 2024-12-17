import React, { useEffect, useState } from "react";
import Loader from "../../../../loader/loader";
import axios from "axios";
import { BACKEND_URL } from "../../../../constant";

const Skills = () => {
  const [skill, setSkill] = useState("");
  const [level, setLevel] = useState("");
  const [skillsList, setSkillsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);

  const userData = localStorage.getItem('user');
  const parsedData = JSON.parse(userData);
  const studentID = parsedData.id;
  const token = localStorage.getItem("token");

  const skills = [
    "Accounting", "Agile Development", "Android Development", "Angular",
    "API Development", "Azure", "Big Data", "Blockchain", "C#", "C++",
    "Cloud Computing", "CSS", "Cybersecurity", "Data Analysis", "Data Science",
    "Database Management", "Django", "Docker", "ElasticSearch", "Embedded Systems",
    "Ethical Hacking", "Flutter", "Front End Development", "Game Development",
    "Git", "Google Cloud Platform", "HTML", "iOS Development", "Java",
    "JavaScript", "Jenkins", "Kotlin", "Laravel", "Machine Learning", "MATLAB",
    "MongoDB", "MySQL", "Node.js", "Objective-C", "Perl", "PHP", "PostgreSQL",
    "PowerShell", "Python", "React", "Ruby", "Rust", "Salesforce", "Scrum",
    "SQL", "Swift", "Terraform", "TypeScript", "UI/UX Design", "Unity", "Vue.js",
    "Web Development", "XML", "Xamarin"
  ];

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/skill/read?StudentId=${studentID}`, {
          headers: {
            Authorization: token,
          },
        });

        if (response.status === 200) {
          setSkillsList(response.data.skills);
        } else {
          alert("An unexpected error occurred.");
        }
      } catch (error) {
        alert("An error occurred while fetching skills.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkills();
  }, [studentID, token]);

  const handleAddSkill = async (e) => {
    e.preventDefault();

    const levelValue = parseInt(level, 10);
    if (!skill || !level || levelValue < 1 || levelValue > 10) {
      alert("Please enter a valid skill and a level between 1 and 10.");
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/skill/create`, {
        Skill: skill,
        Level: levelValue,
        StudentID: studentID,
      }, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 201) {
        setSkillsList([...skillsList, { Skill: skill, Level: levelValue, SkillID: response.data.skillID }]);
        setSkill("");
        setLevel("");
        alert(response.data.message);
      } else {
        alert("An unexpected error occurred.");
      }
    } catch (error) {
      alert("An error occurred while adding the skill.");
    }
  };

  const handleOpenModal = (index) => {
    setCurrentSkill(skillsList[index]);
    setIsModalOpen(true);
  };

  const handleUpdateSkill = async (updatedSkill, updatedLevel) => {
    try {
      const response = await axios.put(`${BACKEND_URL}/skill/update/${currentSkill.SkillID}`, {
        SkillId: currentSkill.SkillID,
        Skill: updatedSkill,
        Level: updatedLevel,
      }, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        const updatedSkillsList = skillsList.map((item) =>
          item.SkillID === currentSkill.SkillID ? { ...item, Skill: updatedSkill, Level: updatedLevel } : item
        );
        setSkillsList(updatedSkillsList);
        alert(response.data.message);
      } else {
        alert("Failed to update skill.");
      }
    } catch (error) {
      alert("An error occurred while updating the skill.");
    }
  };

  const handleDeleteSkill = async (index) => {
    const skillToDelete = skillsList[index];

    try {
      const response = await axios.delete(`${BACKEND_URL}/skill/delete/${skillToDelete.SkillID}`, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        const updatedSkillsList = skillsList.filter((_, i) => i !== index);
        setSkillsList(updatedSkillsList);
        alert(response.data.message);
      } else {
        alert("Failed to delete skill.");
      }
    } catch (error) {
      alert("An error occurred while deleting the skill.");
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="p-8 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">Add Your Skills</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleAddSkill} className="mb-6">
        <div className="mb-4">
          <label className="block text-left text-gray-700 text-sm font-bold mb-2" htmlFor="skill">
            Skill:
          </label>
          <select
            id="skill"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Select a skill</option>
            {skills.map((skill, index) => (
              <option key={index} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-left text-gray-700 text-sm font-bold mb-2" htmlFor="level">
            Level (out of 10):
          </label>
          <input
            type="number"
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter level"
            min="1"
            max="10"
            required
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Add Skill
        </button>
      </form>

      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-700">Your Skills</h2>
        {skillsList.length > 0 ? (
          <ul className="list-disc list-inside ml-4">
            {skillsList.map((item, index) => (
              <li key={item.SkillID} className="flex justify-between items-center text-gray-700 mb-2">
                <span>
                  {item.Skill} - Level: {item.Level}/10
                </span>
                <div>
                  <button
                    onClick={() => handleOpenModal(index)}
                    className="ml-4 px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    Update
                  </button>

                  <button
                    onClick={() => handleDeleteSkill(index)}
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No skills added yet.</p>
        )}
      </div>

      {/* Modal for updating skill */}
      {currentSkill && (
        <SkillModal
          skill={currentSkill}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleUpdateSkill}
        />
      )}
    </div>
  );
};

const SkillModal = ({ skill, isOpen, onClose, onSave }) => {
  const [newSkill, setNewSkill] = useState(skill.Skill);
  const [newLevel, setNewLevel] = useState(skill.Level);

  const handleSave = () => {
    onSave(newSkill, newLevel);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed w-screen inset-0 z-50 bg-[#000000aa] grid items-center justify-center">
      <div className="bg-white p-6 opacity-100 rounded-lg shadow-lg w-full max-w-md z-50 relative">
        <h3 className="text-xl font-bold mb-4">Update Skill</h3>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="skill">
            Skill:
          </label>
          <input
            type="text"
            id="skill"
            value={newSkill}
            disabled
            onChange={(e) => setNewSkill(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="level">
            Level (out of 10):
          </label>
          <input
            type="number"
            id="level"
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            min="1"
            max="10"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Update
          </button>
          <button
            onClick={onClose}
            className="ml-4 px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Skills;
