import { useState } from 'react';

const Login = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [students, setStudents] = useState([]);
    const [ok, setOk] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('http://localhost:8080/student/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, address }),
        })
            .then(res => res.text())
            .then(data => {
                console.log(data);
                setName('');
                setAddress('');
            })
            .catch(err => console.error('Error:', err));
    };

    // Using async/await
const getAll = () => {
        setOk(true);

        fetch('http://localhost:8080/student/getAll')
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setStudents(data);
            })
            .catch(err => console.error('Error:', err));
    };

    const less = () => {
        setOk(false);
    };

    return (
        <div className=" flex flex-col justify-center items-center h-screen bg-gray-100 w-full px-96">
            <form
                onSubmit={handleSubmit}
                className=" w-full flex flex-col"
            >
                <h2 className="text-xl font-semibold mb-4 text-center">Add Student</h2>
                <div className="mb-3">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div className='mb-4'>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter address"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <button
                    type="submit"
                    className=" bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    Submit
                </button>
            </form>

            <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4 w-full mt-3"
                onClick={getAll}
            >
                Get All
            </button>

            {ok && (
                <div className=" bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                    <h3 className="text-lg font-bold mb-4">Student List</h3>
                    {students.map((student) => (
                        <div
                            key={student._id}
                            className="border-b border-gray-200 pb-3 mb-3"
                        >
                            <p><strong>Name:</strong> {student.name}</p>
                            <p><strong>Address:</strong> {student.address}</p>
                        </div>
                    ))}
                    <button
                        onClick={less}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Show Less
                    </button>
                </div>
            )}
        </div>
    );
};

export default Login;
