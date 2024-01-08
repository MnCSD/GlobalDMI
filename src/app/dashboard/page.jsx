"use client";

import Image from "next/image";
import exifr from "exifr";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { auth, db, storage } from "../../../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Dashboard() {
  const [files, setFiles] = useState(null);
  const hiddenFileInput = useRef(null);
  const [data, setData] = useState([]);
  const [address, setAddress] = useState("");
  const [imgUrl, setImgUrl] = useState(null);
  const [progresspercent, setProgresspercent] = useState(0);
  const [user, setUser] = useState(null);
  const [name ,setName] = useState("")
  const [description, setDescription] = useState("")
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/login");
      }
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!files) return;

    const storageRef = ref(storage, `files/${files.name}`);
    const uploadTask = uploadBytesResumable(storageRef, files);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgresspercent(progress);
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          setImgUrl(downloadURL);

          const newImageRef = doc(collection(db, "images"));
          await setDoc(newImageRef, {
            url: downloadURL,
            description: description || "",
            address: address || "No Address",
            date: format(new Date(data[0]?.DateTimeOriginal), "dd/MM/yyyy"),
            width: data[0]?.ExifImageWidth || "No Width",
            height: data[0]?.ExifImageHeight || "No Height",
            name: name || "",
            email: user.email || "No Email",
          })
            .then(() => {
              toast("Image Uploaded Successfully");
              router.push("/");
            })
            .catch((error) => {
              toast("Error Uploading Image");
            });
        });
      }
    );
  };

  // http://api.3geonames.org/${data[0]?.latitude},data[0]?.longitude.json

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-[#0F0F0F]">
      <div className="flex justify-center flex-col items-center space-y-10 mt-4">
        <div className="border-2 border-dashed border-gray-400 md:w-[400px] w-[300px] rounded-lg md:h-[500px] h-[400px] flex flex-col items-center justify-center relative">
          <button
            onClick={() => hiddenFileInput.current.click()}
            className="font-[500] text-gray-400 w-full h-full"
          >
            Upload
          </button>
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={async (e) => {
              setFiles(e.target.files[0]);

              let files = Array.from(e.target.files);
              let exifs = await Promise.all(
                files.map((file) => exifr.parse(file))
              );
              setData(exifs);

              const res = await Promise.all(
                exifs.map((exif) =>
                  fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${exif?.latitude},${exif?.longitude}&key=AIzaSyAQPNQadL0kkzhPOLx5Q-ghA6D6YtnHjPc`,
                    {
                      method: "GET",
                      headers: {
                        accept: "application/json",
                      },
                    }
                  ).then((res) => res.json())
                )
              );

              setAddress(res[0]?.plus_code?.compound_code);
            }}
            className=""
            ref={hiddenFileInput}
            style={{ display: "none" }}
          />
          <div>
            {files && (
              <div className="w-[100%] rounded-xl absolute top-0 left-0">
                <img
                  src={URL.createObjectURL(files)}
                  alt=""
                  className="object-contain rounded-xl h-[390px] md:h-[490px] w-[100%]"
                />
              </div>
            )}
          </div>
        </div>
        <div className="">
          <button
            onClick={() => setFiles(null)}
            className="bg-red-500 text-white px-5 py-2 rounded-lg"
          >
            Delete
          </button>

          {/* <div className="text-white">{data[0]?.GPSLatitude}</div> */}
        </div>

        {data && (
          <div className="flex space-y-3 flex-col">
            <div className="border border-gray-400 h-[40px] flex items-center pl-3 rounded-xl md:w-[400px] w-[300px] bg-transparent text-white">
              {data[0]?.ExifImageWidth} x {data[0]?.ExifImageHeight}
            </div>

            <div className="border border-gray-400 h-[40px] pl-3 flex items-center rounded-xl md:w-[400px] w-[300px] bg-transparent">
              {address.substring(9)}
            </div>

            <div className="border border-gray-400 h-[40px] pl-3 rounded-xl flex items-center md:w-[400px] w-[300px] bg-transparent">
              {data[0]?.DateTimeOriginal && (
                <div>
                  {format(new Date(data[0]?.DateTimeOriginal), "dd/MM/yyyy")}
                </div>
              )}
            </div>

            <input
              type="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="border border-gray-400 py-3 pl-3 rounded-xl md:w-[400px] w-[300px] focus:outline-0 text-black"
            />

            
              <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Name"
              className="border border-gray-400 py-3 pl-3 rounded-xl md:w-[400px] w-[300px] focus:outline-0 text-black"
            />

            <button
              className="bg-blue-500 text-white px-5 py-2 rounded-lg"
              onClick={handleSubmit}
            >
              Upload
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
