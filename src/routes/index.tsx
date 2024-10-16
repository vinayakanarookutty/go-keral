import { createBrowserRouter } from "react-router-dom";
import { NotFound } from "../components/notFound";
import HomePage from "../pages/homePage";
import { routePaths } from "../config";
import Maps from "../pages/maps";
import { DriverRegistrationPage } from "../pages/driverRegistration";
import DriverProfile from "../pages/profile";
import DriverLogin from "../pages/driverLogin";
import { AdminLogin } from "../pages/adminLogin";
import AdminRegistrationPage from "../pages/adminRegistration";
import AdminProfile from "../pages/adminProfile";
import DestinationMap from "../pages/addLocations";
import BookingConfirmation from "../pages/bookingConfirmation";
import BookingsPage from "../pages/bookings";
import UserLogin from "../pages/userLogin";

// import { routePaths } from '../config'
// import Maps from '../maps'
// import HomePage from '../pages/homePage'
// import UserRegistration from '../pages/userRegistration'
// import UserLogin from '../pages/UserLogin'
// import  { DriverRegistrationPage } from '../pages/driverRegistration'
// import { DriverLoginPage } from '../pages/driverLogin'
// import Location from '../locations'
// import UserProfile from '../pages/profile'
// import { DriverProfilePage } from '../pages/driverProfile'
export const router = createBrowserRouter([
    {
        path: routePaths.home,
        element: <HomePage />,
        // children: [
        //     {
        //         path: getAppRoutePath(APPS.MAPS, 'maps'),
        //         element: <Maps />,
        //     },

        // ],
    },
    {
        path: routePaths.maps,
        element: <Maps />,
    },
    {
        path: routePaths.driverRegistration,
        element: <DriverRegistrationPage />,
    },
    // {
    //     path:routePaths.userLogin,
    //     element: <UserLogin/>
    // },
    {
        path: routePaths.driverRegistration,
        element: <DriverRegistrationPage />,
    },
    {
        path: routePaths.driverProfile,
        element: <DriverProfile />,
    },
    {
        path: routePaths.driverLogin,
        element: <DriverLogin />,
    },

    {
        path: routePaths.adminLogin,
        element: <AdminLogin />,
    },
    {
        path: routePaths.adminRegistration,
        element: <AdminRegistrationPage />,
    },
    {
        path: routePaths.adminprofile,
        element: <AdminProfile />,
    },
    {
        path: routePaths.addLocations,
        element: <DestinationMap />,
    },
    {
        path: routePaths.bookingconfirmation,
        element: <BookingConfirmation />,
    },
    {
        path: routePaths.bookingsucess,
        element: <BookingsPage />,
    },
    {
        path: routePaths.userLogin,
        element: <UserLogin />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);
if (import.meta.hot) {
    import.meta.hot.dispose(() => router.dispose());
}
