// import React, { useState, useEffect } from "react";
// import { db, storage } from "../firebase";
// import { useNavigate, useParams } from "react-router-dom";
// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// import {
//   addDoc,
//   collection,
//   getDoc,
//   serverTimestamp,
//   doc,
//   updateDoc,
// } from "firebase/firestore";
// import { toast } from "react-toastify";
// import DOMPurify from "dompurify";

// const initialState = {
//   title: "",
//   tags: [],
//   trending: "no",
//   category: "",
//   description: "",
//   comments: [],
//   likes: [],
// };

// const categoryOption = [
//   "Fashion",
//   "Technology",
//   "Food",
//   "Politics",
//   "Sports",
//   "Business",
// ];

// const AddEditBlog = ({ user }) => {
//   const [form, setForm] = useState(initialState);
//   const [file, setFile] = useState(null);
//   const [progress, setProgress] = useState(null);
//   const [sanitizedContent, setSanitizedContent] = useState("");

//   const { id } = useParams();

//   const navigate = useNavigate();

//   const { title, tags, category, trending, description } = form;

//   const isUserAvailable = user !== null; // Check if user is available

//   useEffect(() => {
//     const uploadFile = () => {
//       const storageRef = ref(storage, file.name);
//       const uploadTask = uploadBytesResumable(storageRef, file);
//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress =
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           setProgress(progress);
//           toast.info(`Upload is ${progress}% done`);
//           switch (snapshot.state) {
//             case "paused":
//               console.log("Upload is paused");
//               break;
//             case "running":
//               console.log("Upload is running");
//               break;
//             default:
//               break;
//           }
//         },
//         (error) => {
//           console.log(error);
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
//             toast.info("Image uploaded to Firebase successfully");
//             setForm((prev) => ({ ...prev, imgUrl: downloadUrl }));
//           });
//         }
//       );
//     };

//     // Check if user is available and file is selected
//     if (isUserAvailable && file) {
//       uploadFile();
//     } else if (file && !isUserAvailable) {
//       // Clear the file selection if the user is not logged in
//       setFile(null);
//       toast.error("Login first to perform this action");
//     }
//   }, [file, user]);

//   useEffect(() => {
//     id && getBlogDetail();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const getBlogDetail = async () => {
//     const docRef = doc(db, "blogs", id);
//     const snapshot = await getDoc(docRef);
//     if (snapshot.exists()) {
//       setForm({ ...snapshot.data() });
//     }
//   };

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleTags = (e) => {
//     e.preventDefault();
//     setForm({ ...form, tags });
//   };

//   const handleTrending = (e) => {
//     setForm({ ...form, trending: e.target.value });
//   };

//   const onCategoryChange = (e) => {
//     setForm({ ...form, category: e.target.value });
//   };

//   const handleEditorChange = (content) => {
//     setForm({ ...form, description: content });
//     setSanitizedContent(DOMPurify.sanitize(content));
//   };



//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // Check if all required form fields have values
//       if (category === "" || tags === "" || title === "" || description === "" || trending === "") {
//         throw new Error("All fields are mandatory to fill");
//       }

//       // Check if a user object exists
//       if (!user) {
//         // User not logged in, navigate to "/auth" page
//         throw new Error("Login or Signup to perform this task");
//       }

//       const blogData = {
//         ...form,
//         timestamp: serverTimestamp(),
//         author: user.displayName,
//         userId: user.uid,
//       };

//       // Check if id is falsy, indicating the creation of a new blog
//       if (!id) {
//         // Add a new document to the "blogs" collection
//         await addDoc(collection(db, "blogs"), blogData);
//         toast.success("Blog created successfully");
//       } else {
//         // Update an existing document in the "blogs" collection
//         await updateDoc(doc(db, "blogs", id), blogData);
//         toast.success("Blog updated successfully");
//       }

//       // Navigate to the root ("/") page
//       navigate("/");
//     } catch (err) {
//       console.log(err);
//       toast.error("Fill all the fields and try again.");
//     }
//   };



//   return (
//     <>
//       <div className="bg-gray-100 py-8">
//         <div className="container mx-auto">
//           <div className="text-center text-3xl font-bold py-4">
//             {id ? "Update Blog" : "Create Blog"}
//           </div>
//           <div className="flex h-full justify-center items-center">
//             <div className="w-full max-w-md">
//               <form
//                 className="bg-white rounded-lg shadow-lg px-8 pt-6 pb-4 mb-4"
//                 onSubmit={handleSubmit}
//               >
//                 <div className="mb-4">
//                   <input
//                     type="text"
//                     className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
//                     placeholder="Title"
//                     name="title"
//                     value={title}
//                     onChange={handleChange}
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <div className="flex flex-wrap">
//                     {tags.map((tag, index) => (
//                       <div key={index} className="tag">
//                         {tag}
//                         <span
//                           className="delete-icon"
//                           onClick={() => {
//                             const newTags = [...tags];
//                             newTags.splice(index, 1);
//                             setForm({ ...form, tags: newTags });
//                           }}
//                         >
//                           &#x2715;
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                   <input
//                     type="text"
//                     className="tag-input"
//                     placeholder="Add a tag"
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         const newTags = [...tags, e.target.value.trim()];
//                         setForm({ ...form, tags: newTags });
//                         e.target.value = "";
//                       }
//                     }}
//                                  />
//               </div>
//               <div className="mb-4">
//                 <p className="text-gray-700">Is it a trending blog?</p>
//                 <div className="flex items-center">
//                   <label className="mr-2">
//                     <input
//                       type="radio"
//                       className="mr-1"
//                       value="yes"
//                       name="radioOption"
//                       checked={trending === "yes"}
//                       onChange={handleTrending}
//                     />
//                     Yes
//                   </label>
//                   <label>
//                     <input
//                       type="radio"
//                       className="mr-1"
//                       value="no"
//                       name="radioOption"
//                       checked={trending === "no"}
//                       onChange={handleTrending}
//                     />
//                     No
//                   </label>
//                 </div>
//               </div>
//               <div className="mb-4">
//                 <select
//                   value={category}
//                   onChange={onCategoryChange}
//                   className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
//                 >
//                   <option>Please select a category</option>
//                   {categoryOption.map((option, index) => (
//                     <option value={option || ""} key={index}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="mb-4">
//                 <textarea
//                   type="text"
//                   className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
//                   placeholder="Description"
//                   name="description"
//                   row="10"
//                   value={description}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div className="mb-4">
//                 <input
//                   type="file"
//                   disabled={!isUserAvailable}
//                   accept="image/*"
//                   className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
//                   onChange={(e) => setFile(e.target.files[0])}
//                 />
//               </div>
//               <div className="text-center">
//                 <button
//                   className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                   type="submit"
//                   // disabled={progress !== 100}
//                 >
//                   {id ? "Update" : "Submit"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   </>
// );

// };

// export default AddEditBlog;









import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  addDoc,
  collection,
  getDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import { Editor } from "@tinymce/tinymce-react";

const initialState = {
  title: "",
  tags: [],
  trending: "no",
  category: "",
  description: "",
  comments: [],
  likes: [],
};


const categoryOption = [
  "Fashion",
  "Technology",
  "Food",
  "Politics",
  "Sports",
  "Business",
];

const AddEditBlog = ({ user }) => {
  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [sanitizedContent, setSanitizedContent] = useState("");

  const { id } = useParams();

  const navigate = useNavigate();

  const { title, tags, category, trending, description } = form;

  const isUserAvailable = user !== null; // Check if user is available

  useEffect(() => {
    const uploadFile = () => {
      const storageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
          toast.info(`Upload is ${progress}% done`);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            toast.info("Image uploaded to Firebase successfully");
            setForm((prev) => ({ ...prev, imgUrl: downloadUrl }));
          });
        }
      );
    };

    // Check if user is available and file is selected
    if (isUserAvailable && file) {
      uploadFile();
    } else if (file && !isUserAvailable) {
      // Clear the file selection if the user is not logged in
      setFile(null);
      toast.error("Login first to perform this action");
    }
  }, [file, user]);

  useEffect(() => {
    id && getBlogDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getBlogDetail = async () => {
    const docRef = doc(db, "blogs", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setForm({ ...snapshot.data() });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTags = (e) => {
    e.preventDefault();
    setForm({ ...form, tags });
  };

  const handleTrending = (e) => {
    setForm({ ...form, trending: e.target.value });
  };

  const onCategoryChange = (e) => {
    setForm({ ...form, category: e.target.value });
  };

  // const handleEditorChange = (content) => {
  //   setForm({ ...form, description: content });
  //   setSanitizedContent(DOMPurify.sanitize(content));
  // };
  const handleEditorChange = (content) => {
    setForm({ ...form, description: content });
    setSanitizedContent(DOMPurify.sanitize(content));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if all required form fields have values
      if (category === "" || tags === "" || title === "" || description === "" || trending === "") {
        throw new Error("All fields are mandatory to fill");
      }

      // Check if a user object exists
      if (!user) {
        // User not logged in, navigate to "/auth" page
        throw new Error("Login or Signup to perform this task");
      }

      const blogData = {
        ...form,
        timestamp: serverTimestamp(),
        author: user.displayName,
        userId: user.uid,
      };

      // Check if id is falsy, indicating the creation of a new blog
      if (!id) {
        // Add a new document to the "blogs" collection
        await addDoc(collection(db, "blogs"), blogData);
        toast.success("Blog created successfully");
      } else {
        // Update an existing document in the "blogs" collection
        await updateDoc(doc(db, "blogs", id), blogData);
        toast.success("Blog updated successfully");
      }

      // Navigate to the root ("/") page
      navigate("/");
    } catch (err) {
      console.log(err);
      toast.error("Fill all the fields and try again.");
    }
  };



  return (
    <>
      <div className="bg-gray-100 py-8">
        <div className="container mx-auto">
          <div className="text-center text-3xl font-bold py-4">
            {id ? "Update Blog" : "Create Blog"}
          </div>
          <div className="flex h-full justify-center items-center">
            <div className="w-full max-w-md">
              <form
                className="bg-white rounded-lg shadow-lg px-8 pt-6 pb-4 mb-4"
                onSubmit={handleSubmit}
              >
                <div className="mb-4">
                  <input
                    type="text"
                    className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                    placeholder="Title"
                    name="title"
                    value={title}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <div className="flex flex-wrap">
                    {tags.map((tag, index) => (
                      <div key={index} className="tag">
                        {tag}
                        <span
                          className="delete-icon"
                          onClick={() => {
                            const newTags = [...tags];
                            newTags.splice(index, 1);
                            setForm({ ...form, tags: newTags });
                          }}
                        >
                          &#x2715;
                        </span>
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="tag-input"
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const newTags = [...tags, e.target.value.trim()];
                        setForm({ ...form, tags: newTags });
                        e.target.value = "";
                      }
                    }}
                  />
                </div>
                <div className="mb-4">
                  <p className="text-gray-700">Is it a trending blog?</p>
                  <div className="flex items-center">
                    <label className="mr-2">
                      <input
                        type="radio"
                        className="mr-1"
                        value="yes"
                        name="radioOption"
                        checked={trending === "yes"}
                        onChange={handleTrending}
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        className="mr-1"
                        value="no"
                        name="radioOption"
                        checked={trending === "no"}
                        onChange={handleTrending}
                      />
                      No
                    </label>
                  </div>
                </div>
                <div className="mb-4">
                  <select
                    value={category}
                    onChange={onCategoryChange}
                    className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                  >
                    <option>Please select a category</option>
                    {categoryOption.map((option, index) => (
                      <option value={option || ""} key={index}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <Editor
                  apiKey="4q3rvg7uaidu2b1zrughb11xna49no81n456ojnxojwp4r2j"
                  init={{
                    height: 300,
                    menubar: true, // Set to true to enable the menu bar
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount',
                      'contextmenu directionality emoticons template',
                      'textpattern',
                      'autoresize',
                      'autosave',
                      'wordcount',
                      'spellchecker',
                      'fullscreen',
                      'noneditable',
                      'preview',
                    ],
                    toolbar:
                      'undo redo | formatselect | ' +
                      'bold italic backcolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help | link image media | emoticons template | ' +
                      'spellchecker fullscreen preview',
                    content_style: 'body { font-family: "Helvetica", sans-serif; font-size: 14px }',
                  }}
                  onEditorChange={(content, editor) => handleEditorChange(content)}
                />
                <div className="mb-4 mt-2">
                  <label htmlFor="formattedDescription" className="block text-gray-700 text-sm font-bold mb-2">
                    Formatted Description
                  </label>
                  <div
                    className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                    id="formattedDescription"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(sanitizedContent) }}
                  />
                </div>

                <div className="mb-4">
                  <input
                    type="file"
                    disabled={!isUserAvailable}
                    accept="image/*"
                    className="w-full py-2 px-4 border border-gray-300 rounded focus:outline-none focus:border-blue-400"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </div>
                <div className="text-center">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                  // disabled={progress !== 100}
                  >
                    {id ? "Update" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );

};

export default AddEditBlog;











