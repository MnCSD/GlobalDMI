"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { BarLoader, ClipLoader } from "react-spinners";

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true)
  const [countriesData, setCountriesData] = useState([])
  const [selectedImage, setSelectedImage] = useState("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && user?.emailVerified) {
        setUser(user);
      } else {
        // router.push("/register")
      }
    });
  }, []);

  

  const getData = async () => {
    const imagesData = [];
    const querySnapshot = await getDocs(collection(db, "images"));

    querySnapshot.forEach((doc) => {
      imagesData.push(doc.data());
    });

    setData(imagesData);

    const uniqueCountries = Array.from(new Set(imagesData.map(item => item.country)));

    // Creating an object to store arrays of items for each country
    
    const countriesDataByEach = uniqueCountries.map(country => {
      return {
        country: country,
        items: imagesData.filter(item => item.country === country)
      };
    });

    setCountriesData(countriesDataByEach)

    setLoading(false)
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <main className=" min-h-screen bg-[#0F0F0F]">
      {/*Header*/}

      <nav className="w-full h-[40px] flex items-center md:justify-end justify-center md:pr-10 pt-[60px] md:pt-4">
        {user ? (
          <div className="flex md:flex-row flex-col items-center justify-center md:gap-x-3 gap-y-3">
            <h3>Hello, {user.displayName}</h3>

            <Link
              href="/dashboard"
              className="bg-blue-500 text-white px-5 py-2 rounded-lg"
            >
              Analyze image
            </Link>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-blue-500 text-white px-5 py-2 rounded-lg"
          >
            Login
          </Link>
        )}
      </nav>

      <h2 className="text-center font-semibold text-3xl md:mt-4 mt-[60px]">
        Gallery
      </h2>

      {/*Body*/}

          {loading ? (
            <div className="flex items-center justify-center mt-[150px]">
              <ClipLoader color="#3B82F6" size={40}/>
            </div>
          ) : ( 
          
          <div>

          
          <div className="flex items-center justify-center flex-wrap md:gap-x-10 mt-10 p-10 gap-y-10">
          {data.map((item) => (
            <div className="border border-blue-500 relative rounded-lg cursor-pointer" key={item.url} onClick={() => [
              setSelectedImage(item.url),
              setOpen(!open)
            ]}>
              <img src={item.url} alt="" className="w-[300px] h-[200px] object-cover rounded-lg cursor-pointer" />
  
              <div className="absolute bg-white/50 w-[100%] bottom-0 left-0">
                <h3 className="text-center font-semibold text-xl">{item.name}</h3>
                <p className="text-center font-semibold text-sm">
                  {item.description}
                </p>
  
                <div className="text-center">
                  <span>Location: {item.address.substring(9)}</span>
                </div>
  
                <div className="flex items-center justify-center">
                  <span>Date: {item.date}</span>
                </div>
              </div>
            </div>
          ))}


         

          
            

            </div>
        </div>)}

        <div className="mt-10">

        
        {countriesData.map((country, idx) => (
              <div className="md:pl-14 " key={idx}>
                <span className="text-white">Photos from <span className="text-white font-semibold">{country.country}</span> </span>
                <div className="flex items-center justify-center flex-wrap md:gap-x-10 mt-10 p-10 gap-y-10">
                {country.items.map((item, idx) => (
                  
                    <div className="border border-blue-500 relative rounded-lg" key={item.url}>
                    <img src={item.url} alt="" className="w-[300px] h-[200px] object-cover rounded-lg" />
        
                    <div className="absolute bg-white/50 w-[100%] bottom-0 left-0">
                      <h3 className="text-center font-semibold text-xl">{item.name}</h3>
                      <p className="text-center font-semibold text-sm">
                        {item.description}
                      </p>
        
                      <div className="text-center">
                        <span>Location: {item.address.substring(9)}</span>
                      </div>
        
                      <div className="flex items-center justify-center">
                        <span>Date: {item.date}</span>
                      </div>
                    </div>
                  </div>
                  
                ))}
                </div>
              </div>
            ))}        
      </div>


      {open && (
        <div className="fixed top-0 w-screen h-screen left-0 bg-black bg-opacity-60 flex items-center justify-center">
          
        
             <img src={selectedImage} alt="" className="w-[80%] h-[90%] object-cover rounded-lg"/> 
             <span onClick={() => setOpen(!open)} className="absolute top-2 right-2 bg-gray-500 w-10 h-10 rounded-full cursor-pointer flex items-center justify-center">x</span>

      
          
        </div>
      )}
    </main>
  );
}
