import React, { useState } from 'react';

/* -------------------------------------------------------------- */
/*  RoomManagement Component                                      */
/* -------------------------------------------------------------- */
const RoomManagement = () => {
  /* 1. STATE --------------------------------------------------- */
  const [rooms, setRooms] = useState([
    { id: 1, number: '101', type: 'Deluxe Room',   status: 'Available',   price: 3200, capacity: 2, amenities: ['Wi-Fi','TV','Mini Bar'] },
    { id: 2, number: '102', type: 'Standard Room', status: 'Occupied',    price: 2500, capacity: 2, amenities: ['Wi-Fi'] },
    { id: 3, number: '103', type: 'Suite',         status: 'Available',   price: 3500, capacity: 4, amenities: ['Wi-Fi','TV','Air Conditioning','Bath Tub'] },
    { id: 4, number: '104', type: 'Deluxe Room',   status: 'Maintenance', price: 32000, capacity: 2 },
    { id: 5, number: '105', type: 'Standard Room', status: 'Available',   price: 2500, capacity: 2 },
    { id: 6, number: '201', type: 'Suite',         status: 'Occupied',    price: 4000, capacity: 4, amenities: ['Wi-Fi','Balcony','Ocean View'] },
  ]);

  const [filterStatus, setFilterStatus] = useState('All');

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
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newId = rooms.length ? Math.max(...rooms.map(r => r.id))+1 : 1;
    setRooms([...rooms, { id:newId, ...newRoom }]);
    setShowAddModal(false);
    setNewRoom(blankRoom);
  };

  /* 6. EDIT EXISTING ROOM ------------------------------------- */
  const openEdit = (room) => { setEditedRoom({ ...room, amenities: room.amenities||[] }); setShowEditModal(true); };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    setRooms(prev => prev.map(r => r.id===editedRoom.id ? editedRoom : r));
    setShowEditModal(false);
  };

  /* 7. VIEW DETAILS ------------------------------------------- */
  const openView = (room) => { setSelectedRoom(room); setShowViewModal(true); };

  /* 8. RENDER -------------------------------------------------- */
  return (
    <div className="p-6">
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

      {/* Tabs */}
      <div className="flex mb-6">
        {['All','Available','Occupied','Maintenance'].map(s=>(
          <button key={s}
            className={`mr-4 px-4 py-2 rounded ${filterStatus===s?'bg-yellow-300 text-black':'bg-gray-200'}`}
            onClick={()=>setFilterStatus(s)}
          >{s}</button>
        ))}
      </div>

      {/* Room Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room=>(
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
          </div>
        ))}
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
    </div>
  );
};

/* ---------- UI Helpers ---------- */
const StatusPill = ({status}) => (
  <span className={`px-3 py-1 rounded-full text-sm font-semibold
    ${status==='Available' ? 'bg-green-100 text-green-800': ''}
    ${status==='Occupied'  ? 'bg-red-100 text-red-800': ''}
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
      <LabeledSelect label="Status*" name="status" value={roomData.status} options={['Available','Occupied','Maintenance']} onChange={onChange}/>
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