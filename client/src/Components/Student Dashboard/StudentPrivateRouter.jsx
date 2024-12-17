import React from 'react';
import { Navigate } from 'react-router-dom';

const StudentPrivateRoute = ({
    studentNavbar: StudentNavbar,
    component: Component,
}) => {
    const isStudentSignedIn = !!localStorage.getItem('token');

    if (isStudentSignedIn) {
        const role = localStorage.getItem("role")

            if(role === 'Employer'){
                return (
                    <div>
                        {StudentNavbar && <StudentNavbar />}
                        <Component />
                    </div>
                );
        }else{
            return (
                <div>
                    {StudentNavbar && <StudentNavbar />}
                    <Component />
                </div>
            );
        }
       
    }

    // Redirect to student login page if not signed in
    return <Navigate to="/" />;
};

export default StudentPrivateRoute;
