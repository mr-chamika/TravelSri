import { useState } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [students, setStudents] = useState([])
  const [ok, setOk] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    fetch('http://localhost:8080/student/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name, address: address }),
    })
      .then(res => res.text())
      .then(data => { console.log(data) })
      .catch(err => console.error('Error:', err))
  }

  const getAll = () => {

    setOk(true)

    fetch('http://localhost:8080/student/getAll')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setStudents(data)
      })
      .catch(err => console.error('Error:', err))

  }

  const less = () => {

    setOk(false);

  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />
        </div>
        <div>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      <button onClick={getAll}>Get all</button>
      {ok &&

        <div>
          {
            students.map((student) => {

              return (
                <div key={student._id} style={{ marginBottom: '20px' }}>
                  <p>Name: {student.name}</p>
                  <p>Address: {student.address}</p>
                </div>
              )

            })
          }
          <button onClick={less}>show less</button>
        </div>

      }

    </div>
  )
}

export default App
