import {Navigate} from "react-router-dom";

//children is the protected component . eg: EmployeeList , FepartmentList
const ProtectedRoute = ({children }) => {
    //checks if the user is logged in 
    //if token exists --> user is authenticated
    //if not --> user is not authenticated
    const token =localStorage.getItem("access");
    //if logged in -->show the protected page
    //if not -->redirect to login page
    return token?children:<Navigate to="/" />;
}

export default ProtectedRoute;