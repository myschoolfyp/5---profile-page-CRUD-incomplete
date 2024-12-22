"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Profile() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [teachersData, setTeachersData] = useState<any[]>([]);
  const [adminsData, setAdminsData] = useState<any[]>([]);

  const [editProfileFields, setEditProfileFields] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    password: "",
  });
  
  const [isFormVisible, setIsFormVisible] = useState(false);

// State for managing the delete pop-up, search term, and filtered users
const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);
const [deleteSearchTerm, setDeleteSearchTerm] = useState("");
const [filteredDeleteUsers, setFilteredDeleteUsers] = useState(studentsData);  // Assuming studentsData is your user data


  const [newStudent, setNewStudent] = useState({
    id: "",
    name: "",
    class: "",
    contact: "",
    subjects: "",
  });

const [showPasswordPopup, setShowPasswordPopup] = useState(false);
const [password, setPassword] = useState("");




  const [error, setError] = useState("");
  const [activeData, setActiveData] = useState<"students" | "teachers" | "admins" | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  const [isTableVisible, setIsTableVisible] = useState<{ [key: string]: boolean }>({
    students: false,
    teachers: false,
    admins: false,
  });
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  useEffect(() => {
    const userTypeParam = searchParams.get("userType");
    const email = localStorage.getItem("email");

    if (userTypeParam && email) {
      setUserType(userTypeParam);
      fetchUserData(email, userTypeParam);
      fetchStudentsData();
     
    } else {
      setError("Login First to Enter Profile Dashboard");
    }
  }, [searchParams]);

  const fetchUserData = async (email: string, userType: string) => {
    try {
      const response = await fetch("/api/profile", {
        headers: {
          email,
          userType,
        },
      });
      const data = await response.json();
      if (data.message) {
        setError(data.message);
      } else {
        setUserData(data);
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to fetch user details");
    }
  };

  const fetchStudentsData = async () => {
    try {
      const response = await fetch("/api/students");
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to fetch students data");
      setStudentsData(data);
    } catch (err) {
      console.error(err);
      setError("An unknown error occurred");
    }
  };

 

 
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddStudent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      });
  
      const data = await response.json();
  
      // Handle error responses
      if (data.error) {
        setError(data.message);  // Show the error message in the form (e.g., "Student ID already exists")
        return;
      }
  
      // If no error, proceed with adding the student
      setStudentsData((prevStudents) => [...prevStudents, data.student]); // Update the table immediately
  
      alert("Student added successfully!");
      setIsFormVisible(false);
      setNewStudent({ id: "", name: "", class: "", contact: "", subjects: "" });
    } catch (err: any) {
      console.error(err.message);
      setError("An unknown error occurred while adding the student.");
    }
  };

  // Function to handle search in the delete pop-up
// Function to handle search in the delete pop-up by ID only
const handleDeleteSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
  const searchValue = event.target.value.toLowerCase();
  setDeleteSearchTerm(searchValue);

  // If searchValue is empty, clear the filtered users list
  if (searchValue === "") {
    setFilteredDeleteUsers([]); // Don't show any users when the search bar is empty
  } else {
    // Filter the users by 'id' only when search term is provided
    const filtered = studentsData.filter((student) =>
      student.id && String(student.id).toLowerCase().includes(searchValue)  // Ensure the 'id' matches the search
    );
    setFilteredDeleteUsers(filtered);  // Update the filtered user list
  }
};


// Function to open the delete pop-up
const handleDeleteAll = () => {
  setIsDeletePopupVisible(true);  // Show the delete pop-up
};
// Function to confirm the deletion
const confirmDelete = () => {
  alert("User has been deleted!");  // Replace with actual deletion logic
  setIsDeletePopupVisible(false);  // Close the pop-up after confirming deletion
};



// edit profile part
  
  const handlePasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
  
    try {
      const email = localStorage.getItem("email");
      
      const response = await fetch("/api/profile/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, userType, password }),
      });
  
      const data = await response.json();
  
      if (data.error) {
        setError(data.message); // Show error if password is incorrect
      } else {
        // Pre-fill the form with user data if password is correct
        setEditProfileFields({
          firstName: data.firstName,
          lastName: data.lastName,
          contactNumber: data.contactNumber,
          password: "", // Leave password blank for security
        });
        setShowPasswordPopup(false); // Close the password pop-up
      }
    } catch (err) {
      setError("An error occurred while verifying the password.");
    }
  };
  console.log("Entered password:", password);



  
  

    

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };
 
  

  const toggleTableVisibility = (type: "students" | "teachers" | "admins") => {
    setIsTableVisible((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const handleMenuClick = (dataType: "students" | "teachers" | "admins") => {
    setActiveData(dataType);
    setIsTableVisible({ students: false, teachers: false, admins: false });
    toggleTableVisibility(dataType);
  };

  const filteredStudents = studentsData.filter(
    (student) =>
      student && // Ensure student is not null or undefined
      student.id && // Ensure the student has an ID
      String(student.id).toLowerCase().includes(searchTerm.toLowerCase())  // Convert ID to a string before matching
  );
  



  const handleLogout = () => {
    localStorage.removeItem("email");
    router.push("/Login");
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  

  return (
    <div className="flex bg-gray-50">
      {/* Navbar Menu */}
      
      {isMenuVisible && (
  <nav className="fixed left-0 top-0 h-full bg-white text-[#0F6466] shadow-lg w-64">
    <div className="p-4">
      {/* Menu Items */}
      <div className="flex flex-col mt-4 space-y-6">
        <button
          className="btn bg-[#0F6466] text-white font-semibold py-2 px-4 rounded hover:bg-[#0D4B4C] transition duration-200 shadow-lg"
          onClick={() => handleMenuClick("students")}
        >
          Students
        </button>
        <button
          className="btn bg-[#0F6466] text-white font-semibold py-2 px-4 rounded hover:bg-[#0D4B4C] transition duration-200 shadow-lg"
          onClick={() => handleMenuClick("teachers")}
        >
          Teachers
        </button>
        <button
          className="btn bg-[#0F6466] text-white font-semibold py-2 px-4 rounded hover:bg-[#0D4B4C] transition duration-200 shadow-lg"
          onClick={() => handleMenuClick("admins")}
        >
          Admins
        </button>
      </div>
    </div>

    {/* Logout Button */}
    <div className="absolute bottom-4 left-4 right-4">
      <button
        className="btn bg-[#0F6466] text-white font-semibold py-2 px-4 rounded hover:bg-[#0D4B4C] transition duration-200 shadow-lg w-full"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  </nav>
)}



      {/* Main Content */}
      <main className={`flex-grow p-6 ${isMenuVisible ? "ml-64" : "ml-0"}`}>
      <header className="flex justify-between items-center mb-6">
  <div className="flex items-center">
    {/* Menu Button */}
    <button
      className="btn bg-[#0F6466] text-white font-semibold py-2 px-4 rounded hover:bg-[#0D4B4C] transition duration-200 shadow-lg mr-4"
      onClick={() => setIsMenuVisible(prev => !prev)}
    >
      Menu
    </button>

    {/* Welcome Message */}
    <div className="text-left text-4xl font-bold uppercase text-[#0F6466]">
      Welcome, {userData.firstName} {userData.lastName}
    </div>
  </div>

  {/* Profile Buttons */}
  <div className="flex space-x-4">
    <button className="btn bg-[#0F6466] text-white font-semibold py-2 px-4 rounded hover:bg-[#0D4B4C] transition duration-200 shadow-lg" onClick={() => setShowProfile(prev => !prev)}>
      {showProfile ? "Hide Profile" : "Show Profile"}
    </button>

    <button className="btn bg-[#0F6466] text-white font-semibold py-2 px-4 rounded hover:bg-[#0D4B4C] transition duration-200 shadow-lg" onClick={() => setShowPasswordPopup(true)}>
      Edit Profile
    </button>
  </div>

</header>

  


        {showProfile && (
          <main className="text-center mt-4 border p-4 rounded shadow-lg bg-white">
            <h2 className="text-2xl font-semibold">User Details</h2>
            <div className="mt-2">
              <p className="text-lg text-gray-700"><strong>Email:</strong> {userData.email}</p>
              <p className="text-lg text-gray-700"><strong>Contact Number:</strong> {userData.contactNumber}</p>
            </div>
          </main>
        )}
  


        {/* Dashboard Title */}
        {activeData === null && (
          <h1 className="text-center text-6xl font-bold mt-20 text-[#0F6466]">
            School Management Dashboard
          </h1>
        )}
  



   {/* Students List */}
        {activeData === "students" && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold inline-block">
              Students List 
              <button onClick={() => toggleTableVisibility("students")} className="ml-2 text-xl float-right">
                {isTableVisible.students ? "▼" : "▲"}
              </button>
            </h2>
            {isTableVisible.students && (
              <>
                <div className="flex justify-between items-center mt-2">
  {/* Left side: Search and Add New Button */}
  <div className="flex items-center">
  <input
  type="text"
  value={searchTerm}
  onChange={handleSearch}  // This is your existing handler for the search
  placeholder="Search by ID..."  // Update the placeholder text
  className="border p-2 rounded transition-all duration-300 focus:w-64 w-32"
/>

    <button
      className="btn bg-[#0F6466] text-white font-semibold py-2 px-4 rounded hover:bg-[#0D4B4C] transition duration-200 shadow-lg ml-4"
      onClick={() => setIsFormVisible(true)}
    >
      Add New
    </button>
  </div>

  {/* Right side: Delete Button */}
  <button
    className="btn bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition duration-200 shadow-lg"
    onClick={handleDeleteAll} 
  >
    Delete
  </button>
</div>

                <table className="min-w-full mt-4 border-collapse">
                  <thead>
                    <tr className="bg-[#0F6466] text-white">
                      <th className="p-2 border text-center">ID</th>
                      <th className="p-2 border text-center">Name</th>
                      <th className="p-2 border text-center">Class</th>
                      <th className="p-2 border text-center">Contact</th>
                      <th className="p-2 border text-center">Subjects</th>
                   
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student._id} className="bg-white border-b hover:bg-gray-100">
                        <td className="p-2 border text-center">{student.id}</td>
                        <td className="p-2 border text-center">{student.name}</td>
                        <td className="p-2 border text-center">{student.class}</td>
                        <td className="p-2 border text-center">{student.contact}</td>
                        <td className="p-2 border text-center">{student.subjects.join(", ")}</td>
                       
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}
  

        


  {isFormVisible && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-[#0F6466]">Add New Student</h2>
      
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}
      
      <form
        className="space-y-4"
        onSubmit={handleAddStudent}  // Bind form submit to handleAddStudent
      >
        <div>
          <label className="block text-gray-700 font-medium mb-1">ID</label>
          <input
            type="text"
            name="id"
            value={newStudent.id}
            onChange={handleChange}  // Bind input field to newStudent state
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0F6466]"
            placeholder="Enter ID"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={newStudent.name}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0F6466]"
            placeholder="Enter Name"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Class</label>
          <input
            type="text"
            name="class"
            value={newStudent.class}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0F6466]"
            placeholder="Enter Class"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Contact</label>
          <input
            type="text"
            name="contact"
            value={newStudent.contact}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0F6466]"
            placeholder="Enter Contact"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Subjects</label>
          <input
            type="text"
            name="subjects"
            value={newStudent.subjects}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0F6466]"
            placeholder="Enter Subjects"
            required
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="btn bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition duration-200"
            onClick={() => setIsFormVisible(false)} // Cancel button to close the form
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn bg-[#0F6466] text-white font-semibold py-2 px-4 rounded hover:bg-[#0D4B4C] transition duration-200"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
)}


{showPasswordPopup && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-[#0F6466]">Enter Password</h2>

          <form onSubmit={handlePasswordSubmit}>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border p-2 rounded"
                placeholder="Enter Password"
                required
              />
            </div>

            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                className="btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
                onClick={() => setShowPasswordPopup(false)} // Close pop-up on cancel
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-[#0F6466] text-white py-2 px-4 rounded hover:bg-[#0D4B4C] transition duration-200"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    
  

{isDeletePopupVisible && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-2/3">
      <h2 className="text-2xl font-bold mb-4 text-[#0F6466]">Search User to Delete</h2>
      
      {/* Search Bar */}
      <input
        type="text"
        value={deleteSearchTerm}
        onChange={handleDeleteSearch}  // Now filters by ID
        placeholder="Search by ID..."  // Updated placeholder
        className="border p-2 rounded mb-4 w-full"
      />

      {/* Display filtered users */}
      <div className="space-y-2">
        {filteredDeleteUsers.length > 0 ? (
          filteredDeleteUsers.map((user, index) => (
            <div key={index} className="border-b border-gray-300 pb-2">
              {/* Full details of the user */}
              <p className="font-semibold text-lg text-[#0F6466]">ID: {user.id}</p>
              <p className="text-gray-600">Name: {user.name}</p>
              <p className="text-gray-600">Email: {user.email}</p>
              <p className="text-gray-600">Class: {user.class}</p>
              <p className="text-gray-600">Contact: {user.contact}</p>
              <p className="text-gray-600">Subjects: {user.subjects.join(", ")}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No users found with this ID.</p>
        )}
      </div>

      {/* Cancel and Confirm Buttons */}
      <div className="flex justify-end mt-4 space-x-4">
        <button
          className="btn bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
          onClick={() => setIsDeletePopupVisible(false)}  // Close the pop-up
        >
          Cancel
        </button>
        <button
          className="btn bg-[#0F6466] text-white py-2 px-4 rounded hover:bg-[#0D4B4C] transition duration-200"
          onClick={confirmDelete}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}




      </main>
    </div>
  );
  
}