import React, { useState } from 'react';
import { Search, Filter, Eye, Check, X, Clock, User, Mail, Phone, Calendar, Car, FileText, MapPin, CreditCard } from 'lucide-react';

const VehicleRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  // Sample vehicle registration requests data
  const [requests, setRequests] = useState([
    {
      id: 1,
      vehicleId: 'VH001',
      vehicleOwner: 'Smith Perera',
      firstName: 'Kasun',
      lastName: 'Perera',
      email: 'kasun.perera@email.com',
      phone: '+94 77 123 4567',
      nicNumber: '199012345678',
      licenseNumber: 'B1234567',
      vehicleModel: 'Toyota Prius',
      vehicleYear: 2020,
      vehicleColor: 'White',
      plateNumber: 'CHJ-123',
      engineNumber: 'ENG123456',
      chassisNumber: 'CHS789012',
      fuelType: 'Hybrid',
      seatingCapacity: 4,
      vehicleCategory: 'Economy Hybrid',
      submittedDate: '2024-01-15',
      status: 'pending',
      documents: {
        nicFront: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        nicBack: 'https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        license: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        vehicleBook: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        insurance: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        revenue: 'https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
      }
    },
    {
      id: 2,
      vehicleId: 'VH002',
      vehicleOwner: 'Anjana Alwis',
      firstName: 'Nimal',
      lastName: 'Gunasiri',
      email: 'nimal.g@email.com',
      phone: '+94 71 987 6543',
      nicNumber: '198512345679',
      licenseNumber: 'B7654321',
      vehicleModel: 'Toyota Aqua',
      vehicleYear: 2019,
      vehicleColor: 'Blue',
      plateNumber: 'CAR-143',
      engineNumber: 'ENG654321',
      chassisNumber: 'CHS345678',
      fuelType: 'Hybrid',
      seatingCapacity: 4,
      vehicleCategory: 'Compact Hybrid',
      submittedDate: '2024-01-14',
      status: 'approved',
      documents: {
        nicFront: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        nicBack: 'https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        license: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        vehicleBook: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        insurance: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        revenue: 'https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
      }
    },
    {
      id: 3,
      vehicleId: 'VH003',
      vehicleOwner: 'Kumudu Gunaratne',
      firstName: 'Upul',
      lastName: 'Alwis',
      email: 'upul.alwis@email.com',
      phone: '+94 76 456 7890',
      nicNumber: '199212345680',
      licenseNumber: 'B9876543',
      vehicleModel: 'Toyota Corolla',
      vehicleYear: 2018,
      vehicleColor: 'Red',
      plateNumber: 'COR-192',
      engineNumber: 'ENG987654',
      chassisNumber: 'CHS123789',
      fuelType: 'Petrol',
      seatingCapacity: 4,
      vehicleCategory: 'Standard Sedan',
      submittedDate: '2024-01-13',
      status: 'rejected',
      documents: {
        nicFront: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        nicBack: 'https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        license: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        vehicleBook: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        insurance: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        revenue: 'https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
      }
    },
    {
      id: 4,
      vehicleId: 'VH004',
      vehicleOwner: 'Davis Henry',
      firstName: 'Piyal',
      lastName: 'Thushara',
      email: 'piyal.t@email.com',
      phone: '+94 75 234 5678',
      nicNumber: '198812345681',
      licenseNumber: 'B5432167',
      vehicleModel: 'Toyota Hiace',
      vehicleYear: 2017,
      vehicleColor: 'White',
      plateNumber: 'VAN-156',
      engineNumber: 'ENG456789',
      chassisNumber: 'CHS987654',
      fuelType: 'Diesel',
      seatingCapacity: 8,
      vehicleCategory: 'Premium Van',
      submittedDate: '2024-01-12',
      status: 'pending',
      documents: {
        nicFront: 'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        nicBack: 'https://images.pexels.com/photos/6801642/pexels-photo-6801642.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        license: 'https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        vehicleBook: 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        insurance: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop',
        revenue: 'https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop'
      }
    }
  ]);

  const handleStatusChange = (requestId, newStatus) => {
    setRequests(requests.map(request => 
      request.id === requestId ? { ...request, status: newStatus } : request
    ));
    setConfirmAction(null);
  };

  const handleConfirmAction = (requestId, action, driverName) => {
    setConfirmAction({ requestId, action, driverName });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <Check className="w-4 h-4" />;
      case 'rejected': return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Economy Hybrid': return 'bg-blue-100 text-blue-800';
      case 'Compact Hybrid': return 'bg-green-100 text-green-800';
      case 'Standard Sedan': return 'bg-purple-100 text-purple-800';
      case 'Premium Van': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.vehicleModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.vehicleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.vehicleOwner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Vehicle Registration Requests</h1>
        <p className="text-gray-600">Review and manage vehicle registration requests from drivers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border-[0.5px] border-gray-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Requests</div>
              <div className="text-2xl font-bold text-gray-900">{requests.length}</div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border-[0.5px] border-gray-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border-[0.5px] border-gray-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Approved</div>
              <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border-[0.5px] border-gray-300 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Rejected</div>
              <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <X className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border-[0.5px] border-gray-300 p-6 mb-6">   
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by vehicle ID, owner, driver name, email, vehicle model, or plate number..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border-[0.5px] border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-[0.5px] border-gray-300">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Owner
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Driver Details
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Information
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Documents
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{request.vehicleId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{request.vehicleOwner}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{request.firstName} {request.lastName}</div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Mail className="w-4 h-4 mr-1" />
                        {request.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Phone className="w-4 h-4 mr-1" />
                        {request.phone}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        License: {request.licenseNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{request.vehicleModel}</div>
                      <div className="text-sm text-gray-500">{request.plateNumber} • {request.vehicleYear}</div>
                      <div className="text-sm text-gray-500">{request.vehicleColor} • {request.seatingCapacity} seats</div>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getCategoryColor(request.vehicleCategory)}`}>
                        {request.vehicleCategory}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="grid grid-cols-3 gap-1">
                      <div className="text-center">
                        <img 
                          src={request.documents.nicFront} 
                          alt="NIC" 
                          className="w-12 h-8 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity mx-auto"
                          onClick={() => setSelectedDocuments({ type: 'NIC', front: request.documents.nicFront, back: request.documents.nicBack, name: `${request.firstName} ${request.lastName}` })}
                        />
                        <div className="text-xs text-gray-500 mt-1">NIC</div>
                      </div>
                      <div className="text-center">
                        <img 
                          src={request.documents.license} 
                          alt="License" 
                          className="w-12 h-8 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity mx-auto"
                          onClick={() => setSelectedDocuments({ type: 'License', image: request.documents.license, name: `${request.firstName} ${request.lastName}` })}
                        />
                        <div className="text-xs text-gray-500 mt-1">License</div>
                      </div>
                      <div className="text-center">
                        <img 
                          src={request.documents.vehicleBook} 
                          alt="Vehicle Book" 
                          className="w-12 h-8 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity mx-auto"
                          onClick={() => setSelectedDocuments({ type: 'Vehicle Book', image: request.documents.vehicleBook, name: `${request.firstName} ${request.lastName}` })}
                        />
                        <div className="text-xs text-gray-500 mt-1">Book</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedDocuments({ type: 'All Documents', documents: request.documents, name: `${request.firstName} ${request.lastName}` })}
                      className="text-xs text-blue-600 hover:text-blue-800 mt-2 block"
                    >
                      View All Documents
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(request.submittedDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleConfirmAction(request.id, 'approved', `${request.firstName} ${request.lastName}`)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleConfirmAction(request.id, 'rejected', `${request.firstName} ${request.lastName}`)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                  confirmAction.action === 'approved' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {confirmAction.action === 'approved' ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <X className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {confirmAction.action === 'approved' ? 'Approve Request' : 'Reject Request'}
                  </h3>
                  <p className="text-sm text-gray-500">{confirmAction.driverName}</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to {confirmAction.action === 'approved' ? 'approve' : 'reject'} this vehicle registration request?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleStatusChange(confirmAction.requestId, confirmAction.action)}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                    confirmAction.action === 'approved' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {confirmAction.action === 'approved' ? 'Approve' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Modal */}
      {selectedDocuments && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{selectedDocuments.type} - {selectedDocuments.name}</h2>
                <button
                  onClick={() => setSelectedDocuments(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {selectedDocuments.type === 'NIC' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Front Side</label>
                    <img 
                      src={selectedDocuments.front} 
                      alt="NIC Front" 
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Back Side</label>
                    <img 
                      src={selectedDocuments.back} 
                      alt="NIC Back" 
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                </div>
              )}
              
              {selectedDocuments.type === 'All Documents' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">NIC Front</label>
                    <img 
                      src={selectedDocuments.documents.nicFront} 
                      alt="NIC Front" 
                      className="w-full h-40 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">NIC Back</label>
                    <img 
                      src={selectedDocuments.documents.nicBack} 
                      alt="NIC Back" 
                      className="w-full h-40 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Driving License</label>
                    <img 
                      src={selectedDocuments.documents.license} 
                      alt="License" 
                      className="w-full h-40 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Book</label>
                    <img 
                      src={selectedDocuments.documents.vehicleBook} 
                      alt="Vehicle Book" 
                      className="w-full h-40 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Insurance</label>
                    <img 
                      src={selectedDocuments.documents.insurance} 
                      alt="Insurance" 
                      className="w-full h-40 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Revenue License</label>
                    <img 
                      src={selectedDocuments.documents.revenue} 
                      alt="Revenue License" 
                      className="w-full h-40 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                </div>
              )}
              
              {selectedDocuments.type !== 'NIC' && selectedDocuments.type !== 'All Documents' && (
                <div className="flex justify-center">
                  <img 
                    src={selectedDocuments.image} 
                    alt={selectedDocuments.type} 
                    className="max-w-full h-96 object-contain rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Vehicle Registration Request Details</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Vehicle Provider Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Owner Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle ID</label>
                    <p className="text-gray-900">{selectedRequest.vehicleId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Owner</label>
                    <p className="text-gray-900">{selectedRequest.vehicleOwner}</p>
                  </div>
                </div>
              </div>

              {/* Driver Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <p className="text-gray-900">{selectedRequest.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <p className="text-gray-900">{selectedRequest.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <p className="text-gray-900">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <p className="text-gray-900">{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number</label>
                    <p className="text-gray-900">{selectedRequest.nicNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                    <p className="text-gray-900">{selectedRequest.licenseNumber}</p>
                  </div>
                </div>
              </div>

              {/* Vehicle Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Owner</label>
                    <p className="text-gray-900">{selectedRequest.vehicleOwner}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
                    <p className="text-gray-900">{selectedRequest.vehicleModel}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <p className="text-gray-900">{selectedRequest.vehicleYear}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                    <p className="text-gray-900">{selectedRequest.vehicleColor}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
                    <p className="text-gray-900">{selectedRequest.plateNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Engine Number</label>
                    <p className="text-gray-900">{selectedRequest.engineNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chassis Number</label>
                    <p className="text-gray-900">{selectedRequest.chassisNumber}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                    <p className="text-gray-900">{selectedRequest.fuelType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seating Capacity</label>
                    <p className="text-gray-900">{selectedRequest.seatingCapacity} seats</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(selectedRequest.vehicleCategory)}`}>
                      {selectedRequest.vehicleCategory}
                    </span>
                  </div>
                </div>
              </div>

              {/* Documents Preview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Submitted Documents</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="text-center">
                    <img 
                      src={selectedRequest.documents.nicFront} 
                      alt="NIC Front" 
                      className="w-full h-20 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedDocuments({ type: 'NIC', front: selectedRequest.documents.nicFront, back: selectedRequest.documents.nicBack, name: `${selectedRequest.firstName} ${selectedRequest.lastName}` })}
                    />
                    <div className="text-xs text-gray-500 mt-1">NIC Front</div>
                  </div>
                  <div className="text-center">
                    <img 
                      src={selectedRequest.documents.nicBack} 
                      alt="NIC Back" 
                      className="w-full h-20 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedDocuments({ type: 'NIC', front: selectedRequest.documents.nicFront, back: selectedRequest.documents.nicBack, name: `${selectedRequest.firstName} ${selectedRequest.lastName}` })}
                    />
                    <div className="text-xs text-gray-500 mt-1">NIC Back</div>
                  </div>
                  <div className="text-center">
                    <img 
                      src={selectedRequest.documents.license} 
                      alt="License" 
                      className="w-full h-20 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedDocuments({ type: 'License', image: selectedRequest.documents.license, name: `${selectedRequest.firstName} ${selectedRequest.lastName}` })}
                    />
                    <div className="text-xs text-gray-500 mt-1">License</div>
                  </div>
                  <div className="text-center">
                    <img 
                      src={selectedRequest.documents.vehicleBook} 
                      alt="Vehicle Book" 
                      className="w-full h-20 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedDocuments({ type: 'Vehicle Book', image: selectedRequest.documents.vehicleBook, name: `${selectedRequest.firstName} ${selectedRequest.lastName}` })}
                    />
                    <div className="text-xs text-gray-500 mt-1">Vehicle Book</div>
                  </div>
                  <div className="text-center">
                    <img 
                      src={selectedRequest.documents.insurance} 
                      alt="Insurance" 
                      className="w-full h-20 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedDocuments({ type: 'Insurance', image: selectedRequest.documents.insurance, name: `${selectedRequest.firstName} ${selectedRequest.lastName}` })}
                    />
                    <div className="text-xs text-gray-500 mt-1">Insurance</div>
                  </div>
                  <div className="text-center">
                    <img 
                      src={selectedRequest.documents.revenue} 
                      alt="Revenue License" 
                      className="w-full h-20 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => setSelectedDocuments({ type: 'Revenue License', image: selectedRequest.documents.revenue, name: `${selectedRequest.firstName} ${selectedRequest.lastName}` })}
                    />
                    <div className="text-xs text-gray-500 mt-1">Revenue</div>
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              {selectedRequest.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      handleConfirmAction(selectedRequest.id, 'approved', `${selectedRequest.firstName} ${selectedRequest.lastName}`);
                      setSelectedRequest(null);
                    }}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve Request
                  </button>
                  <button
                    onClick={() => {
                      handleConfirmAction(selectedRequest.id, 'rejected', `${selectedRequest.firstName} ${selectedRequest.lastName}`);
                      setSelectedRequest(null);
                    }}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Reject Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleRequests;