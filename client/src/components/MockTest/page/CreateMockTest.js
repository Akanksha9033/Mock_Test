


// import { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import * as XLSX from "xlsx";
 
// const CreateMockTest = () => {
//     const { user } = useContext(AuthContext);
//     const navigate = useNavigate();
 
//     const [mockTest, setMockTest] = useState({
//         title: "",
//         price: "",
//         isFree: false,
//         duration: 0,
//         excelFile: null,
//         wallpaper: null, // ✅ added wallpaper
//         questions: [],
//     });
 
//     useEffect(() => {
//         if (user?.role?.toLowerCase() !== "admin") {
//             console.log(user?.role?.toLowerCase());
//             navigate("/mock-tests");
//         }
//     }, [user, navigate]);
 
//     if (!user) {
//         return <p>Loading...</p>;
//     }
 
//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setMockTest((prev) => ({
//             ...prev,
//             [name]:
//                 type === "checkbox"
//                     ? checked
//                     : name === "duration"
//                     ? value === "" ? "" : Number(value)
//                     : value,
//         }));
//     };
 
//     const handleFileUpload = (e) => {
//         const file = e.target.files[0];
//         if (!file) {
//             console.log("No file selected");
//             return;
//         }
 
//         if (
//             file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
//             file.type !== "application/vnd.ms-excel"
//         ) {
//             alert("Please upload a valid Excel file.");
//             return;
//         }
 
//         const reader = new FileReader();
//         reader.onload = (event) => {
//             const base64String = event.target.result.split(",")[1];
//             setMockTest((prev) => ({
//                 ...prev,
//                 excelFile: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64String}`,
//             }));
//         };
//         reader.readAsDataURL(file);
//     };
 
//     // ✅ Wallpaper upload handler
//     const handleWallpaperUpload = (e) => {
//         const file = e.target.files[0];
//         if (!file) return;
 
//         const reader = new FileReader();
//         reader.onloadend = () => {
//             setMockTest((prev) => ({
//                 ...prev,
//                 wallpaper: reader.result,
//             }));
//         };
//         reader.readAsDataURL(file);
//     };
 
//     const handleSubmit = async (e) => {
//         e.preventDefault();
 
//         if (!mockTest.title.trim()) {
//             alert("Please provide a valid title.");
//             return;
//         }
//         if (!mockTest.isFree && !mockTest.price) {
//             alert("Please provide a price for the mock test.");
//             return;
//         }
//         if (!mockTest.excelFile) {
//             alert("Please upload an Excel file.");
//             return;
//         }
 
//         const formattedMockTest = {
//             title: mockTest.title.trim(),
//             price: mockTest.isFree ? 0 : Number(mockTest.price) || 0,
//             isFree: mockTest.isFree,
//             duration: Number(mockTest.duration) || 0,
//             excelFile: mockTest.excelFile,
//             wallpaper: mockTest.wallpaper || null, // ✅ include wallpaper
//             questions: JSON.stringify(mockTest.questions),
//         };
 
//         try {
//             const response = await fetch("${"https://mocktest-ljru.onrender.com"}/api/admin/mock-tests", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(formattedMockTest),
//             });
 
//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message || "Failed to create mock test");
//             }
 
//             const data = await response.json();
//             navigate("/mock-tests");
//         } catch (error) {
//             console.error("❌ Error in fetch:", error.message);
//             alert(`Error: ${error.message}`);
//         }
//     };
 
//     return (
//         <div className="container mt-5">
//             <h2>Create a New Mock Test</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="mb-3">
//                     <label className="form-label">Title*</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         name="title"
//                         placeholder="Enter mock test title"
//                         value={mockTest.title}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
 
//                 <div className="mb-3">
//                     <label className="form-label">Price</label>
//                     <input
//                         type="number"
//                         className="form-control"
//                         name="price"
//                         placeholder="Enter price"
//                         value={mockTest.price}
//                         onChange={handleChange}
//                     />
//                 </div>
 
//                 <div className="form-check mb-3">
//                     <input
//                         className="form-check-input"
//                         type="checkbox"
//                         name="isFree"
//                         checked={mockTest.isFree}
//                         onChange={handleChange}
//                     />
//                     <label className="form-check-label">Make this a free mock test</label>
//                 </div>
 
//                 <div className="mb-3">
//                     <label className="form-label">Duration (in minutes)*</label>
//                     <input
//                         type="number"
//                         className="form-control"
//                         name="duration"
//                         placeholder="Enter duration"
//                         value={mockTest.duration}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
 
//                 <div className="mb-3">
//                     <label className="form-label">Upload Excel File</label>
//                     <input type="file" className="form-control" accept=".xlsx, .xls" onChange={handleFileUpload} />
//                 </div>
 
//                 {/* ✅ Wallpaper uploader */}
//                 <div className="mb-3">
//                     <label className="form-label">Upload Test Wallpaper (Image)</label>
//                     <input type="file" className="form-control" accept="image/*" onChange={handleWallpaperUpload} />
//                 </div>
 
//                 {mockTest.questions.length > 0 && (
//                     <div className="mt-3">
//                         <h5>📌 Extracted Questions Preview:</h5>
//                         <ul className="list-group">
//                             {mockTest.questions.map((q, index) => (
//                                 <li key={index} className="list-group-item">
//                                     <strong>Q{index + 1}: {q.question}</strong>
//                                     <ul>
//                                         {q.options.map((opt, i) => (
//                                             <li key={i}><strong>{opt.option}:</strong> {opt.text}</li>
//                                         ))}
//                                     </ul>
//                                     <p><strong>Answer:</strong> {q.answer}</p>
//                                     <p><strong>Explanation:</strong> {q.explanation}</p>
//                                     <p><strong>Tags:</strong> {q.tags.join(", ")}</p>
//                                     <p><strong>Level:</strong> {q.level}</p>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}
 
//                 <div className="d-flex gap-2 mt-3">
//                     <button type="submit" className="btn btn-success">Create</button>
//                     <button type="button" className="btn btn-secondary" onClick={() => navigate("/mock-tests")}>
//                         Cancel
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };
 
// export default CreateMockTest;

 
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import * as XLSX from "xlsx";


// const REACT_APP_API_URL = "https://mocktest-ljru.onrender.com";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;


const CreateMockTest = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
 
    const [mockTest, setMockTest] = useState({
        title: "",
        price: "",
        isFree: false,
        duration: 0,
        excelFile: null,
        wallpaper: null, // ✅ added wallpaper
        questions: [],
    });


    
 
    useEffect(() => {
        if (
            user?.role?.toLowerCase() !== "admin" &&
            user?.role?.toLowerCase() !== "teacher"
        ) {
            console.log(user?.role?.toLowerCase());
            navigate("/mock-tests");
        }
    }, [user, navigate]);
    
 
    if (!user) {
        return <p>Loading...</p>;
    }
 
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setMockTest((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : name === "duration"
                    ? value === "" ? "" : Number(value)
                    : value,
        }));
    };
 
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) {
            console.log("No file selected");
            return;
        }
 
        if (
            file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
            file.type !== "application/vnd.ms-excel"
        ) {
            alert("Please upload a valid Excel file.");
            return;
        }
 
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64String = event.target.result.split(",")[1];
            setMockTest((prev) => ({
                ...prev,
                excelFile: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64String}`,
            }));
        };
        reader.readAsDataURL(file);
    };
 
    // ✅ Wallpaper upload handler
    const handleWallpaperUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
 
        const reader = new FileReader();
        reader.onloadend = () => {
            setMockTest((prev) => ({
                ...prev,
                wallpaper: reader.result,
            }));
        };
        reader.readAsDataURL(file);
    };
 
    const handleSubmit = async (e) => {
        e.preventDefault();
 
        if (!mockTest.title.trim()) {
            alert("Please provide a valid title.");
            return;
        }
        if (!mockTest.isFree && !mockTest.price) {
            alert("Please provide a price for the mock test.");
            return;
        }
        if (!mockTest.excelFile) {
            alert("Please upload an Excel file.");
            return;
        }
 
        const formattedMockTest = {
            title: mockTest.title.trim(),
            price: mockTest.isFree ? 0 : Number(mockTest.price) || 0,
            isFree: mockTest.isFree,
            duration: Number(mockTest.duration) || 0,
            excelFile: mockTest.excelFile,
            wallpaper: mockTest.wallpaper || null, // ✅ include wallpaper
            questions: JSON.stringify(mockTest.questions),
        };
 
        try {
            const response = await fetch(`${REACT_APP_API_URL}/api/admin/mock-tests`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedMockTest),
            });
 
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create mock test");
            }
 
            const data = await response.json();
            navigate("/mock-tests");
        } catch (error) {
            console.error("❌ Error in fetch:", error.message);
            alert(`Error: ${error.message}`);
        }
    };
 
    return (
        <div className="container mt-5">
            <h2>Create a New Mock Test</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title*</label>
                    <input
                        type="text"
                        className="form-control"
                        name="title"
                        placeholder="Enter mock test title"
                        value={mockTest.title}
                        onChange={handleChange}
                        required
                    />
                </div>
 
                <div className="mb-3">
                    <label className="form-label">Price</label>
                    <input
                        type="number"
                        className="form-control"
                        name="price"
                        placeholder="Enter price"
                        value={mockTest.price}
                        onChange={handleChange}
                    />
                </div>
 
                <div className="form-check mb-3">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        name="isFree"
                        checked={mockTest.isFree}
                        onChange={handleChange}
                    />
                    <label className="form-check-label">Make this a free mock test</label>
                </div>
 
                <div className="mb-3">
                    <label className="form-label">Duration (in minutes)*</label>
                    <input
                        type="number"
                        className="form-control"
                        name="duration"
                        placeholder="Enter duration"
                        value={mockTest.duration}
                        onChange={handleChange}
                        required
                    />
                </div>
 
                <div className="mb-3">
                    <label className="form-label">Upload Excel File</label>
                    <input type="file" className="form-control" accept=".xlsx, .xls" onChange={handleFileUpload} />
                </div>
 
                {/* ✅ Wallpaper uploader */}
                <div className="mb-3">
                    <label className="form-label">Upload Test Wallpaper (Image)</label>
                    <input type="file" className="form-control" accept="image/*" onChange={handleWallpaperUpload} />
                </div>
 
                {mockTest.questions.length > 0 && (
                    <div className="mt-3">
                        <h5>📌 Extracted Questions Preview:</h5>
                        <ul className="list-group">
                            {mockTest.questions.map((q, index) => (
                                <li key={index} className="list-group-item">
                                    <strong>Q{index + 1}: {q.question}</strong>
                                    <ul>
                                        {q.options.map((opt, i) => (
                                            <li key={i}><strong>{opt.option}:</strong> {opt.text}</li>
                                        ))}
                                    </ul>
                                    <p><strong>Answer:</strong> {q.answer}</p>
                                    <p><strong>Explanation:</strong> {q.explanation}</p>
                                    <p><strong>Tags:</strong> {q.tags.join(", ")}</p>
                                    <p><strong>Level:</strong> {q.level}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
 
                <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-success">Create</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/mock-tests")}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};
 
export default CreateMockTest;
 
 
 