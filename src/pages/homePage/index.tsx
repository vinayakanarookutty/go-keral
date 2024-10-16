import React,{useState} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser,  faHome, faInfoCircle, faDollar, faPhone, faSignInAlt, faUserPlus, faComment, faStar, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { AppstoreOutlined, MailOutlined, MenuUnfoldOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
const HomePage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const popularRoutes = [
    {
      name: "Allepey house boat",
      image:
        "../../../public/allapey.jpg",
      description:
        "Alappuzha is a prominent tourist destination in Kerala. The town is famous for its waterways and backwaters, and has been described as the Venice of the East.",
    },
    {
      name: "Munnar",
      image: "../../../public/idukki.jpg",
      description:
        "Munnar is situated at the confluence of three mountain streams – Muthirapuzha, Nallathanni and Kundala – and the word 'Munnar' means three rivers in Malayalam.",
    },
    {
      name: "Palakkad",
      image:
        "../../../public/munnar.jpg",
      description:
        "Palakkad is in the central region of Kerala, bordered by the Malappuram, Thrissur, Nilgiris, and Coimbatore districts. It's about 216 miles northeast of the state capital, Thiruvananthapuram.",
    },
    {
      name: "Jadayu para",
      image:
        "../../../public/jatayu.jpg",
      description:
        "Jatayu Earth Center, also known as Jatayu Nature Park or Jatayu Rock, is a park and tourism centre at Chadayamangalam in Kollam district of Kerala, India.",
    },
    {
      name: "Trivandrum",
      image:
        "../../../public/sree.jpg",
      description:
        "Thiruvananthapuram, formerly known as Trivandrum, is the capital city of the Indian state of Kerala.",
    },
  ];
 
  const reviews = [
    
    {
      author: "Mike R.",
      content: "Excellent experience from start to finish. Highly recommended!",
      rating: 5,
    },
    {
      author: "John D.",
      content:
        "Great service! The car was clean and the driver was professional.",
      rating: 5,
    },
    {
      author: "Sarah M.",
      content: "Easy booking process and competitive prices. Will use again!",
      rating: 4,
    },
    {
      author: "Mike R.",
      content: "Excellent experience from start to finish. Highly recommended!",
      rating: 5,
    },
  ];
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === popularRoutes.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? popularRoutes.length - 1 : prev - 1));
  };

  const items: MenuItem[] = [
    {
      key: 'sub1',
      icon: <MenuUnfoldOutlined/>,
      children: [
        {
          key: 'g1',
          label: 'Item 1',
          type: 'group',
          children: [
            { key: '1', label: 'Option 1' },
            { key: '2', label: 'Option 2' },
          ],
        },
        {
          key: 'g2',
          label: 'Item 2',
          type: 'group',
          children: [
            { key: '3', label: 'Option 3' },
            { key: '4', label: 'Option 4' },
          ],
        },
      ],
    },
    
  ];
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };


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
       {/* <div className="pt-[10%]">
       <Menu
      onClick={onClick}
      style={{ width: 86 }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      items={items}
    />

       </div> */}
         
          {/* <nav className="hidden md:flex space-x-4 ">
          
            <button style={{fontWeight:"700",fontSize:"20px"}} className="bg-white-900 text-black text-white px-12 py-2 rounded-full flex items-center">
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
              Login
            </button>
            <button style={{fontWeight:"700",fontSize:"20px"}} className="bg-white-900 text-black text-blue-900 px-12 py-2  flex items-center">
              <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
              Sign Up
            </button>
          </nav> */}
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
      {/* <footer className="bg-blue-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="text-white hover:text-gray-300">
              <FontAwesomeIcon icon={faFacebookF} />
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="#" className="text-white hover:text-gray-300">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </div>
          <p className="text-center mb-2">Contact: info@vehiclebooking.com | Phone: (123) 456-7890</p>
          <p className="text-center">© 2024 VehicleBooking. All rights reserved.</p>
        </div>
      </footer> */}
  

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