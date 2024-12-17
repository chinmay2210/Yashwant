import React, { useState } from "react";

function HostEvent() {
    const [eventDetails, setEventDetails] = useState({
        title: "",
        date: "",
        description: "",
    });




    const handleEventInputChange = (e) => {
        const { name, value } = e.target;
        setEventDetails({ ...eventDetails, [name]: value });
    };

    const handleEventSubmit = (e) => {
        e.preventDefault();
        // Here you would typically send the event details to your backend
        console.log("Event submitted:", eventDetails);
        // Reset form
        setEventDetails({ title: "", date: "", description: "" });
        alert("Event created successfully!");
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Host Events</h2>
            <form
                onSubmit={handleEventSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
                <div className="mb-4">
                    <label
                        className=" text-gray-700 text-sm font-bold mb-2"
                        htmlFor="title"
                    >
                        Event Title
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="title"
                        type="text"
                        placeholder="Enter event title"
                        name="title"
                        value={eventDetails.title}
                        onChange={handleEventInputChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label
                        className=" text-gray-700 text-sm font-bold mb-2"
                        htmlFor="date"
                    >
                        Event Date
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="date"
                        type="date"
                        name="date"
                        value={eventDetails.date}
                        onChange={handleEventInputChange}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label
                        className="text-gray-700 text-sm font-bold mb-5"
                        htmlFor="description"
                    >
                        Event Description
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="description"
                        placeholder="Enter event description"
                        name="description"
                        value={eventDetails.description}
                        onChange={handleEventInputChange}
                        required
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Create Event
                    </button>
                </div>
            </form>
        </div>
    )
}

export default HostEvent