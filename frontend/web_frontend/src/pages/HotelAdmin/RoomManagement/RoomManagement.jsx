import React, { useState, useEffect } from 'react';
import roomService from '../../../services/roomService';

/* -------------------------------------------------------------- */
/*  RoomManagement Component                                      */
/* -------------------------------------------------------------- */
const RoomManagement = () => {
  /* 1. STATE --------------------------------------------------- */
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Toast notification state
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success', // 'success', 'error', or 'info'
  });

  // Function to show toast messages
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    // Auto-hide after 4 seconds
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  // Fetch all rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const data = await roomService.getAllRooms();
        setRooms(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to load rooms. Please try again later.");
        showToast("Failed to load rooms. Please try again later.", "error");
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedRoomType, setSelectedRoomType] = useState(null);

  /* --- Add-room modal state --- */
  const blankRoom = {
    number: '',
    type: 'Standard Room',
    status: 'Available',
    price: '',
    capacity: 2,
    description: '',
    amenities: [],
  };
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoom, setNewRoom] = useState(blankRoom);

  /* --- View & Edit modal state --- */
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [editedRoom, setEditedRoom]     = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  /* --- Delete confirmation modal state --- */
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /* 2. CONSTANTS & HELPERS ------------------------------------ */
  const roomTypes = ['Standard Room','Deluxe Room','Suite','Family Room','Executive Suite'];
  const availableAmenities = [
    'Wi-Fi','TV','Air Conditioning','Mini Bar','Safe',
    'Balcony','Ocean View','Bath Tub','Shower','Room Service',
  ];

  const filteredRooms =
    filterStatus === 'All' ? rooms : rooms.filter(r => r.status === filterStatus);

  /* 3. GENERIC FIELD HANDLER ---------------------------------- */
  const updateStateObj = (e, setter) => {
    const { name, value } = e.target;
    setter(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value)||'' : value }));
  };

  /* 4. AMENITY TOGGLE (works for both add & edit) -------------- */
  const toggleAmenity = (setter) => (amenity) =>
    setter(prev => {
      const list = [...(prev.amenities || [])];
      const i = list.indexOf(amenity);
      i >= 0 ? list.splice(i,1) : list.push(amenity);
      return { ...prev, amenities: list };
    });

  /* 5. ADD NEW ROOM SUBMIT ------------------------------------ */
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send new room data to API
      const savedRoom = await roomService.createRoom(newRoom);
      // Update local state with the saved room (which will include the ID from the server)
      setRooms([...rooms, savedRoom]);
      setShowAddModal(false);
      setNewRoom(blankRoom);
      // Show success message
      showToast(`Room ${savedRoom.number} has been successfully added`, 'success');
    } catch (err) {
      console.error("Error adding room:", err);
      showToast(`Failed to add room: ${err.message || 'Unknown error'}`, 'error');
    }
  };

  /* 6. EDIT EXISTING ROOM ------------------------------------- */
  const openEdit = (room) => { setEditedRoom({ ...room, amenities: room.amenities||[] }); setShowEditModal(true); };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send updated room data to API
      const updatedRoom = await roomService.updateRoom(editedRoom.id, editedRoom);
      // Update local state with the updated room
      setRooms(prev => prev.map(r => r.id===editedRoom.id ? updatedRoom : r));
      setShowEditModal(false);
      // Show success message
      showToast(`Room ${updatedRoom.number} has been successfully updated`, 'success');
    } catch (err) {
      console.error("Error updating room:", err);
      showToast(`Failed to update room: ${err.message || 'Unknown error'}`, 'error');
    }
  };

  /* 7. VIEW DETAILS ------------------------------------------- */
  const openView = (room) => { setSelectedRoom(room); setShowViewModal(true); };
  
  /* 7a. DELETE ROOM -------------------------------------------- */
  const openDeleteConfirmation = (room) => {
    setRoomToDelete(room);
    setShowDeleteModal(true);
  };
  
  const handleDeleteRoom = async () => {
    if (!roomToDelete) return;
    
    try {
      // Send delete request to API
      await roomService.deleteRoom(roomToDelete.id);
      
      // Update local state by removing the deleted room
      setRooms(prev => prev.filter(room => room.id !== roomToDelete.id));
      
      // Close the modal
      setShowDeleteModal(false);
      
      // Show success message
      showToast(`Room ${roomToDelete.number} has been successfully deleted`, 'success');
      
      // Reset the roomToDelete
      setRoomToDelete(null);
    } catch (err) {
      console.error("Error deleting room:", err);
      showToast(`Failed to delete room: ${err.message || 'Unknown error'}`, 'error');
    }
  };

  /* 8. ORGANIZE ROOMS BY TYPE ---------------------------------- */
  const getRoomsByType = () => {
    // Get unique room types from the filtered rooms
    const types = [...new Set(filteredRooms.map(room => room.type))];
    
    // Create an object with room types as keys and arrays of rooms as values
    const roomsByType = {};
    types.forEach(type => {
      roomsByType[type] = filteredRooms.filter(room => room.type === type);
    });
    
    return roomsByType;
  };
  
  // Set the initial selected room type when filtered rooms change
  useEffect(() => {
    const roomTypes = Object.keys(getRoomsByType());
    if (roomTypes.length > 0 && !roomTypes.includes(selectedRoomType)) {
      setSelectedRoomType(roomTypes[0]);
    }
  }, [filteredRooms, selectedRoomType]);

  /* 9. RENDER -------------------------------------------------- */
  return (
    <div className="p-6">
      {/* Toast Notification */}
      {toast.show && (
        <div 
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-md shadow-md flex items-center transform transition-all duration-300 ease-in-out translate-y-0 opacity-100
            ${toast.type === 'success' ? 'bg-green-500 text-white' : ''}
            ${toast.type === 'error' ? 'bg-red-500 text-white' : ''}
            ${toast.type === 'info' ? 'bg-blue-500 text-white' : ''}
          `}
        >
          <span className="material-icons mr-2">
            {toast.type === 'success' ? 'check_circle' : ''}
            {toast.type === 'error' ? 'error' : ''}
            {toast.type === 'info' ? 'info' : ''}
          </span>
          {toast.message}
          <button 
            className="ml-4 text-white opacity-70 hover:opacity-100 transition-opacity" 
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
          >
            <span className="material-icons text-sm">close</span>
          </button>
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Room Inventory</h2>
        <button
          className="bg-yellow-300 hover:bg-yellow-400 text-black px-4 py-2 rounded flex items-center"
          onClick={()=>setShowAddModal(true)}
        >
          <span className="material-icons mr-2">add</span> Add New Room
        </button>
      </header>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-gray-200 border-l-yellow-500 rounded-full animate-spin">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {/* Status Tabs */}
      <div className="flex mb-6 flex-wrap">
        {['All','Available','Booked','Reserved','Maintenance'].map(s=>(
          <button key={s}
            className={`mr-4 px-4 py-2 rounded mb-2 ${filterStatus===s?'bg-yellow-300 text-black':'bg-gray-200'}`}
            onClick={()=>setFilterStatus(s)}
          >{s}</button>
        ))}
      </div>

      {/* Room Type Tabs */}
      <div className="flex flex-wrap mb-6 border-b">
        {Object.entries(getRoomsByType()).map(([roomType, rooms]) => (
          <button key={roomType}
            className={`mr-4 px-4 py-2 rounded-t ${selectedRoomType===roomType?'bg-yellow-300 text-black border-b-2 border-yellow-400':'bg-gray-200'}`}
            onClick={()=>setSelectedRoomType(roomType)}
          >{roomType} ({rooms.length})</button>
        ))}
      </div>

      {/* Room Cards for Selected Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedRoomType && getRoomsByType()[selectedRoomType] && 
          getRoomsByType()[selectedRoomType].map(room => (
            <div key={room.id} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">Room {room.number}</h3>
                  <p className="text-gray-600">{room.type}</p>
                </div>
                <StatusPill status={room.status}/>
              </div>

              <InfoRow icon="person" label={`Capacity: ${room.capacity} Guests`} />
              <InfoRow icon="attach_money" label={`LKR ${room.price}/Night`} />

              {/* Amenities Chips */}
              {room.amenities?.length>0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {room.amenities.slice(0,3).map(a=>(
                    <span key={a} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">{a}</span>
                  ))}
                  {room.amenities.length>3 && (
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs">
                      +{room.amenities.length-3} more
                    </span>
                  )}
                </div>
              )}

              <div className="flex space-x-2 mt-4">
                <button className="flex-1 bg-yellow-100 text-yellow-700 py-2 rounded hover:bg-yellow-200"
                  onClick={()=>openEdit(room)}
                >Edit</button>
                <button className="flex-1 bg-gray-100 text-gray-600 py-2 rounded hover:bg-gray-200"
                  onClick={()=>openView(room)}
                >Details</button>
              </div>
              <div className="mt-2">
                <button className="w-full bg-red-100 text-red-700 py-1 rounded hover:bg-red-200 text-sm"
                  onClick={() => openDeleteConfirmation(room)}
                >Delete</button>
              </div>
            </div>
          ))
        }
      </div>

      {/* ---------------- Add Modal ---------------- */}
      {showAddModal && (
        <Modal title="Add New Room" onClose={()=>setShowAddModal(false)}>
          <form onSubmit={handleAddSubmit} className="space-y-6">
            <RoomFormFields
              roomData={newRoom}
              roomTypes={roomTypes}
              availableAmenities={availableAmenities}
              onChange={(e)=>updateStateObj(e,setNewRoom)}
              onAmenityToggle={toggleAmenity(setNewRoom)}
            />
            <ModalActions onCancel={()=>setShowAddModal(false)} confirmLabel="Add Room"/>
          </form>
        </Modal>
      )}

      {/* ---------------- Edit Modal ---------------- */}
      {showEditModal && editedRoom && (
        <Modal title={`Edit Room ${editedRoom.number}`} onClose={()=>setShowEditModal(false)}>
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <RoomFormFields
              roomData={editedRoom}
              roomTypes={roomTypes}
              availableAmenities={availableAmenities}
              onChange={(e)=>updateStateObj(e,setEditedRoom)}
              onAmenityToggle={toggleAmenity(setEditedRoom)}
            />
            <ModalActions onCancel={()=>setShowEditModal(false)} confirmLabel="Save Changes"/>
          </form>
        </Modal>
      )}

      {/* ---------------- View Modal ---------------- */}
      {showViewModal && selectedRoom && (
        <Modal title={`Room ${selectedRoom.number} Details`} onClose={()=>setShowViewModal(false)}>
          <div className="grid grid-cols-2 gap-6 text-gray-800">
            <Detail label="Room Type" value={selectedRoom.type}/>
            <Detail label="Status" status value={selectedRoom.status}/>
            <Detail label="Price / Night" value={`LKR ${selectedRoom.price}`}/>
            <Detail label="Capacity" value={`${selectedRoom.capacity} Guests`}/>
            {selectedRoom.description && (
              <div className="col-span-2"><Detail label="Description" value={selectedRoom.description}/></div>
            )}
            {selectedRoom.amenities?.length>0 && (
              <div className="col-span-2"><Detail label="Amenities" value={selectedRoom.amenities.join(', ')}/></div>
            )}
          </div>
          <div className="mt-6 text-right">
            <button onClick={()=>setShowViewModal(false)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
            >Close</button>
          </div>
        </Modal>
      )}
      
      {/* ---------------- Delete Confirmation Modal ---------------- */}
      {showDeleteModal && roomToDelete && (
        <Modal title="Confirm Deletion" onClose={() => setShowDeleteModal(false)}>
          <div className="text-center py-6">
            <span className="material-icons text-red-500 text-5xl mb-4">warning</span>
            <h3 className="text-lg font-semibold mb-2">Are you sure you want to delete Room {roomToDelete.number}?</h3>
            <p className="text-gray-600 mb-6">
              This action cannot be undone. This will permanently remove the room from your inventory.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRoom}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* ---------- UI Helpers ---------- */
const StatusPill = ({status}) => (
  <span className={`px-3 py-1 rounded-full text-sm font-semibold
    ${status==='Available' ? 'bg-green-100 text-green-800': ''}
    ${status==='Booked'  ? 'bg-red-100 text-red-800': ''}
    ${status==='Reserved'? 'bg-grey-100 text-grey-800': ''}
    ${status==='Maintenance'? 'bg-yellow-100 text-yellow-800': ''}
  `}>{status}</span>
);
const InfoRow = ({icon,label})=>(
  <div className="flex items-center mb-2"><span className="material-icons text-gray-500 mr-2">{icon}</span>{label}</div>
);
const Detail = ({label,value,status=false})=>(
  <div>
    <h4 className="text-sm font-medium text-gray-500">{label}</h4>
    {status ? <StatusPill status={value}/> : <p className="text-lg font-medium mt-1">{value}</p>}
  </div>
);

/* ---------- Form components ---------- */
const RoomFormFields = ({roomData,roomTypes,availableAmenities,onChange,onAmenityToggle})=>(
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <LabeledInput label="Room Number*" name="number" value={roomData.number} onChange={onChange} required/>
      <LabeledSelect label="Room Type*" name="type" value={roomData.type} options={roomTypes} onChange={onChange}/>
      <LabeledInput label="Price per Night (LKR)*" type="number" name="price" value={roomData.price} min="0" step="0.01" onChange={onChange} required/>
      <LabeledSelect label="Status*" name="status" value={roomData.status} options={['Available','Booked','Reserved','Maintenance']} onChange={onChange}/>
      <LabeledInput label="Capacity (Guests)*" type="number" name="capacity" value={roomData.capacity} min="1" onChange={onChange} required/>
    </div>

    <LabeledTextarea label="Room Description" name="description" value={roomData.description} onChange={onChange}/>
    
    {/* Amenity Checks */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Room Amenities</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {availableAmenities.map(a=>(
          <label key={a} className="flex items-center text-sm">
            <input type="checkbox"
              checked={roomData.amenities?.includes(a)}
              onChange={()=>onAmenityToggle(a)}
              className="h-4 w-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
            />
            <span className="ml-2">{a}</span>
          </label>
        ))}
      </div>
    </div>
  </>
);

const LabeledInput = (props)=>(
  <div><label className="block text-sm font-medium text-gray-700 mb-1">{props.label}</label>
    <input {...props} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"/>
  </div>
);
const LabeledSelect = ({label,options,...rest})=>(
  <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select {...rest} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500">
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);
const LabeledTextarea = ({label,...rest})=>(
  <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <textarea {...rest} rows={rest.rows||3} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-500"/>
  </div>
);

/* ---------- Modal layout ---------- */
const Modal = ({title,onClose,children})=>(
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <header className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
        <h3 className="text-xl font-bold">{title}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <span className="material-icons">close</span>
        </button>
      </header>
      <div className="p-6">{children}</div>
    </div>
  </div>
);

const ModalActions = ({onCancel,confirmLabel})=>(
  <div className="flex justify-end space-x-3 pt-4 border-t">
    <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">Cancel</button>
    <button type="submit" className="px-4 py-2 bg-yellow-300 hover:bg-yellow-400 text-black rounded text-sm font-medium">{confirmLabel}</button>
  </div>
);

export default RoomManagement;