    <div className="p-6">
      {/* Inject animation styles */}
      <style>{styles}</style>
      
      {/* Flash Message */}
      {flashMessage.visible && (
        <FlashMessage 
          message={flashMessage.message}
          type={flashMessage.type}
          onClose={() => setFlashMessage({ ...flashMessage, visible: false })}
        />
      )}
      
      {/* Confirmation Dialog */}
      <ConfirmDialog 
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
      />
    
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Group Trip Packages & Accommodation Quotations</h2>
        <div className="flex space-x-3">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center"
            onClick={() => window.location.href = '/hotel-admin/quotations'}
            disabled={isLoading}
          >
            <span className="material-icons mr-2">list</span> View All Quotations
          </button>
          <button
            className="bg-yellow-300 hover:bg-yellow-400 text-black px-4 py-2 rounded-md flex items-center"
            onClick={() => setShowQuotationModal(true)}
            disabled={isLoading}
          >
            <span className="material-icons mr-2">add</span> Create New Quotation
          </button>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('packages')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'packages'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="material-icons mr-2">explore</span>
              Available Group Trip Packages
            </button>
            <button
              onClick={() => setActiveTab('quotations')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center ${
                activeTab === 'quotations'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span className="material-icons mr-2">assignment</span>
              Accommodation Quotations
            </button>
          </nav>
        </div>
      </div>
      
      {/* Group Trip Packages Tab */}
      {activeTab === 'packages' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center">
              <span className="material-icons mr-2 text-yellow-500">explore</span>
              Available Group Trip Packages
            </h3>
            <p className="text-gray-500">Select a package to create an accommodation quotation</p>
          </div>
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          )}
          
          {/* List view of packages */}
          {!isLoading && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Package Code
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Package Name
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Destinations
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Duration
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Travel Dates
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Group Size
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {groupPackages.map((tripPackage) => (
                    <tr 
                      key={tripPackage.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleViewGroupPackage(tripPackage)}
                    >
                      <td className="py-3 px-4">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md text-xs font-medium">
                          {tripPackage.packageCode}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">{tripPackage.packageName}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="material-icons text-yellow-500 text-xs mr-1">place</span>
                          {tripPackage.destinations.slice(0, 2).join(', ')}
                          {tripPackage.destinations.length > 2 && '...'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center text-sm">
                          <span className="material-icons text-yellow-600 text-xs mr-1">date_range</span>
                          {tripPackage.duration} days
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div>{formatDate(tripPackage.travelStartDate)}</div>
                          <div className="text-xs text-gray-500">to {formatDate(tripPackage.travelEndDate)}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center text-sm">
                          <span className="material-icons text-yellow-600 text-xs mr-1">groups</span>
                          Max {tripPackage.maxGroupSize}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewGroupPackage(tripPackage);
                            }}
                            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded-md text-xs flex items-center"
                          >
                            <span className="material-icons text-xs mr-1">visibility</span>
                            View
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCreateQuotation(tripPackage);
                            }}
                            className="bg-yellow-300 hover:bg-yellow-400 text-black px-3 py-1 rounded-md text-xs flex items-center"
                          >
                            <span className="material-icons text-xs mr-1">hotel</span>
                            Create Quote
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {!isLoading && groupPackages.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Package Code
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Package Name
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Destinations
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Duration
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Travel Dates
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Group Size
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="7" className="py-6 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <span className="material-icons text-3xl text-yellow-300 mb-2">info</span>
                        <p>No group trip packages available.</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Error message for group packages tab */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6">
              <strong className="font-bold mr-1">Error:</strong>
              <span>{error}</span>
            </div>
          )}
        </div>
      )}

      {/* Quotations Tab */}
      {activeTab === 'quotations' && (
        <div>
          {/* Error message for quotations tab */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <strong className="font-bold mr-1">Error:</strong>
              <span>{error}</span>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-center my-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          )}

          {/* Filter tabs */}
          <div className="flex mb-6 overflow-x-auto whitespace-nowrap pb-2">
            {['All', 'Pending', 'Under Review', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                className={`mr-4 px-4 py-2 rounded-md ${
                  filterStatus === status
                    ? 'bg-yellow-300 text-black'
                    : 'bg-gray-200 hover:bg-gray-300'
                } flex items-center`}
                onClick={() => {
                  setFilterStatus(status);
                  setCurrentPage(1); // Reset pagination when filter changes
                }}
                disabled={isLoading}
              >
                {status === 'Under Review' && <span className="material-icons text-xs mr-1">rate_review</span>}
                {status === 'Approved' && <span className="material-icons text-xs mr-1">check_circle</span>}
                {status === 'Rejected' && <span className="material-icons text-xs mr-1">cancel</span>}
                {status === 'Pending' && <span className="material-icons text-xs mr-1">hourglass_empty</span>}
                {status} 
                {status !== 'All' && (
                  <span className="ml-2 bg-white bg-opacity-80 px-2 py-0.5 rounded-full text-xs">
                    {quotations.filter(q => q.status === status).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Quotations table */}
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Quote #
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Package Name
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Accommodation Type
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Check-In Date
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Group Size
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Quote Amount
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentQuotations.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-6 text-center text-gray-500">
                      {isLoading ? 'Loading quotations...' : 'No quotations found.'}
                    </td>
                  </tr>
                ) : (
                  currentQuotations.map((q) => (
                    <tr key={q.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">{q.quoteNumber}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{q.packageName || 'Group Package'}</p>
                          <p className="text-xs text-gray-500">{q.contactPersonName} ({q.contactEmail})</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{q.accommodationType || 'Hotel'}</td>
                      <td className="py-3 px-4">{formatDate(q.departureDate || q.checkInDate)}</td>
                      <td className="py-3 px-4">{q.groupSize} people</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <p className="text-sm">{q.status}</p>
                          {q.reviewDate && (
                            <span className="text-xs text-gray-500">
                              {formatDate(q.reviewDate)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">${q.totalAmount?.toFixed(2)}</p>
                          {q.discountOffered > 0 && (
                            <p className="text-xs text-green-600">
                              {q.discountOffered}% discount
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            className="bg-yellow-300 hover:bg-yellow-400 text-black px-3 py-1 rounded-md text-xs font-medium flex items-center"
                            onClick={() => handleViewDetails(q)}
                          >
                            <span className="material-icons text-xs mr-1">visibility</span> View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredQuotations.length > itemsPerPage && (
            <div className="flex justify-center mt-6">
              <div className="flex space-x-1">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.ceil(filteredQuotations.length / itemsPerPage) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === index + 1
                        ? 'bg-yellow-300 text-black'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === Math.ceil(filteredQuotations.length / itemsPerPage)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === Math.ceil(filteredQuotations.length / itemsPerPage)
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Quotation Modal */}
      {showQuotationModal && (
        <div className="fixed inset-0 bg-grey bg-opacity-80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">New Hotel Accommodation Quotation for Group Trip</h3>
              <button
                onClick={() => setShowQuotationModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-icons">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Form content remains the same */}
            </form>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {showDetailModal && selectedQuotation && (
        <div className="fixed inset-0 bg-grey bg-opacity-80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <QuotationDetailView 
            quotation={selectedQuotation}
            onClose={() => setShowDetailModal(false)}
            onDelete={(id) => {
              setShowDetailModal(false); // First close the modal
              setTimeout(() => handleDeleteClick(id), 100); // Then trigger delete with slight delay
            }}
          />
        </div>
      )}
      
      {/* Group Trip Package Detail Modal */}
      {showGroupPackageModal && selectedGroupPackage && (
        <div className="fixed inset-0 bg-grey bg-opacity-80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <GroupTripDetailView 
            tripPackage={selectedGroupPackage}
            onClose={() => setShowGroupPackageModal(false)}
            onCreateQuotation={handleCreateQuotation}
          />
        </div>
      )}
    </div>
