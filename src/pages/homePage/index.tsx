import React,{useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,  faHome, faInfoCircle, faDollar, faPhone, faSignInAlt, faUserPlus, faComment, faStar, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { AppstoreOutlined, LoginOutlined, MailOutlined, MenuUnfoldOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Menu } from 'antd';
import { AtSignIcon, LogInIcon } from "lucide-react";
import { useUserStore } from "../../store/user";

const HomePage: React.FC = () => {
 
  
  const user = useUserStore((state: any) => state?.userDetails);


  return (
    
   <div >

 
    <div style={{ backgroundImage: "url('../../../public/background.jpg')",backgroundSize: 'cover',
      backgroundPosition: 'center',}} className="min-h-screen flex flex-col ">
      {/* Header */}
      <header  className=" fixed w-full z-10">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex ">
          <a href="#" style={{fontFamily:"Lobster",fontSize:"40px"}} className="text-white flex items-center bold text-2xl">
              Go Keral
            </a>
          <img src="../../../public/gokeral.png" alt="Go Keral Logo" className="h-20" />
          </div>
      
         <div >
       {
        user.email ? (   <a className="pl-5" href="/userProfile"><Button> <p style={{fontFamily:"Lobster",display:"flex"}}>Profile</p></Button></a> ) : ( <a className="pl-5" href="/userRegistration"><Button> <p style={{fontFamily:"Lobster",display:"flex"}}>Registration</p></Button></a>)
       }
    
         </div>
         
        </div>
      </header>

   <div>
   <div className="relative h-96 mb-8 bg-cover bg-center pt-[26.5%] " >
          <div className="absolute inset-0"></div>
          <div className="relative z-10 h-full flex flex-col justify-center px-8">
            <h1 className="text-5xl font-bold text-white mb-4 ">Book Your Ride Today</h1>
            <p className="text-xl text-white max-w-lg">Experience comfort and convenience with our premium vehicle booking service</p>
            <a href="/maps"><button  className="bg-white opacity-2 text-gray-800 px-6 py-2 rounded-lg font-bold w-[11%] mt-5">Book Now</button></a>
          
          </div>
        </div>


   </div>

      {/* Footer */}

  

      {/* Chat Bot */}
      <button className="fixed right-6 bottom-6 bg-blue-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
        <FontAwesomeIcon icon={faComment} className="text-2xl" />
      </button>
    </div>
    
        {/* Popular Routes */}
      
      
 
    </div>
  );
};

export default HomePage;