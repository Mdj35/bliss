import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Modal from '../component/modal';
import Chatbot from '../component/Chatbot';
import FilterModal from '../component/FilterModal';
import { Container, Header, Title, Title1, SearchBox, HelpText, MenuBar, Sidebar, TableContainer, Table, Th, Td, UserInfo, MenuItem, RecommendationItem, RecommendationModal, Navbar, NavbarIcon, PaginationContainer, PaginationButton } from "../design/homepagedesign";

function UserPage() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isDashboardVisible, setIsDashboardVisible] = useState(true);
  const [userName, setUserName] = useState('');
  const [userPosition, setUserPosition] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([
    'NUMBER', 'DATE RECEIVED', 'CLASS', 'AUTHOR', 'TITLE OF BOOK', 'EDITION', 'VOLUME', 'PAGES', 'SOURCE OF FUND', 'COST PRICE', 'PUBLISHER', 'YEAR', 'BARCODE', 'DEPARTMENT', 'REMARKS', 'QUANTITY'
  ]);
  const [dateRange, setDateRange] = useState({ from: '', until: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isEditPasswordModalOpen, setIsEditPasswordModalOpen] = useState(false);
  const [editPassword, setEditPassword] = useState('');

  const handleEditClick = (row) => {
    setEditFormData(row);
    setIsEditPasswordModalOpen(true);
  };

  const handleEditPasswordSubmit = () => {
    if (editPassword === 'sample') { // Replace 'sample' with the actual password
      setIsEditPasswordModalOpen(false);
      setIsEditModalOpen(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    // Create a FormData object and append the form data
    const formData = new FormData();
    Object.keys(editFormData).forEach(key => formData.append(key, editFormData[key]));

    // Send updated data to the backend
    const response = await fetch('https://vynceianoani.helioho.st/bliss/editbook.php', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const updatedTableData = tableData.map((item) =>
        item.id === editFormData.id ? editFormData : item
      );
      setTableData(updatedTableData);
      setFilteredData(updatedTableData);
      setIsEditModalOpen(false);
    } else {
      console.error('Failed to edit data');
    }
  };

  useEffect(() => {
    // Fetch data from PHP API
    const fetchData = async () => {
      const response = await fetch('https://vynceianoani.helioho.st/bliss/getbook.php');
      const data = await response.json();
      const sortedData = data.sort((a, b) => a.id - b.id);
      setTableData(sortedData);
      setFilteredData(sortedData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Lock the back button
    const handlePopState = (event) => {
      event.preventDefault();
      navigate('/user');
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    // Fetch user details from PHP API
    const fetchUserDetails = async () => {
      const email = localStorage.getItem('email');
      if (email) {
        const response = await fetch('https://vynceianoani.helioho.st/bliss/getInfo.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUserName(data.name);
          setUserPosition(data.position);
        } else {
          console.error(data.error || 'Failed to fetch user details');
        }
      }
    };

    fetchUserDetails();
  }, []);

  const handleAddMaterialsClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newData = {
      id: formData.get('id'),
      dateReceived: formData.get('dateReceived'),
      class: formData.get('class'),
      author: formData.get('author'),
      title: formData.get('title'),
      edition: formData.get('edition'),
      volume: formData.get('volume'),
      pages: formData.get('pages'),
      recordOfSource: formData.get('recordOfSource'),
      costPrice: formData.get('costPrice'),
      publisher: formData.get('publisher'),
      year: formData.get('year'),
      barcode: formData.get('barcode'),
      department: formData.get('department'),
      remarks: formData.get('remarks'),
      quantity: formData.get('quantity')
    };

    setFormData(newData);
    setIsModalOpen(true);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = tableData.filter((row) =>
      Object.values(row).some(val =>
        val !== null && val !== undefined && val.toString().toLowerCase().includes(value)
      )
    );
    setFilteredData(filtered);
    setShowRecommendations(value.length > 0);
  };

  const handleRecommendationClick = (recommendation) => {
    setSearchTerm(recommendation.title);
    setShowRecommendations(false);
  };

  const toggleDashboard = () => {
    setIsDashboardVisible(!isDashboardVisible);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalConfirm = async () => {
    setIsModalOpen(false);
    // Send data to PHP API
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));

    const response = await fetch('https://vynceianoani.helioho.st/bliss/addbook.php', {
      method: 'POST',
      body: formDataToSend,
    });

    if (response.ok) {
      const updatedTableData = [...tableData, formData];
      const sortedData = updatedTableData.sort((a, b) => a.id - b.id);
      setTableData(sortedData);
      setFilteredData(sortedData);
      setShowDropdown(false);
      window.location.reload(); // Refresh the screen
    } else {
      console.error('Failed to add data');
    }
  };

  const handleDownloadClick = () => {
    setIsPasswordModalOpen(true);
  };

  const handlePasswordModalClose = () => {
    setIsPasswordModalOpen(false);
    setPassword('');
  };

  const handlePasswordSubmit = () => {
    if (password === 'sample') { // Replace 'sample' with the actual password
      generatePDF();
      handlePasswordModalClose();
    } else {
      alert('Incorrect password');
    }
  };

  const generatePDF = () => {
    const input = document.getElementById('table');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape');
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('Digital_Accession_Records.pdf');
    });
  };

  const handleFilterModalOpen = () => {
    setIsFilterModalOpen(true);
  };

  const handleFilterModalClose = () => {
    setIsFilterModalOpen(false);
  };

  const handleColumnChange = (column) => {
    setSelectedColumns((prevSelectedColumns) =>
      prevSelectedColumns.includes(column)
        ? prevSelectedColumns.filter((col) => col !== column)
        : [...prevSelectedColumns, column]
    );
  };

  const handleDateRangeChange = (from, until) => {
    setDateRange({ from, until });
    const filtered = tableData.filter((row) => {
      const date = new Date(row.date_received);
      const fromDate = new Date(from);
      const untilDate = new Date(until);
      return (!from || date >= fromDate) && (!until || date <= untilDate);
    });
    setFilteredData(filtered);
  };

  const columns = [
    'NUMBER', 'DATE RECEIVED', 'CLASS', 'AUTHOR', 'TITLE OF BOOK', 'EDITION', 'VOLUME', 'PAGES', 'SOURCE OF FUND', 'COST PRICE', 'PUBLISHER', 'YEAR', 'BARCODE', 'DEPARTMENT', 'REMARKS', 'QUANTITY'
  ];

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Container>
      <Sidebar visible={isDashboardVisible}>
        <Navbar>
          <Title1 visible={isDashboardVisible}>DASHBOARD</Title1>
          <NavbarIcon onClick={toggleDashboard} />
        </Navbar>
        {isDashboardVisible && (
          <>
            <UserInfo>🔵 {userName} - {userPosition}</UserInfo>
            <MenuItem onClick={handleFilterModalOpen}>FILTER BY:</MenuItem>
            <MenuItem onClick={handleAddMaterialsClick}>ADD MATERIALS</MenuItem>
            
            {showDropdown && (
            // ...existing code...
<form onSubmit={handleFormSubmit}>
  <input type="date" name="dateReceived" placeholder="Date Received" required />
  <input type="text" name="class" placeholder="Class" required />
  <input type="text" name="author" placeholder="Author" required />
  <input type="text" name="title" placeholder="Title of Book" required />
  <input type="text" name="edition" placeholder="Edition" required />
  <input type="text" name="volume" placeholder="Volume" required />
  <input type="number" name="pages" placeholder="Pages" required />
  <input type="text" name="recordOfSource" placeholder="Record of Source" required />
  <input type="text" name="costPrice" placeholder="Cost Price" required />
  <input type="text" name="publisher" placeholder="Publisher" required />
  <input type="number" name="year" placeholder="Year" required />
  <input type="text" name="barcode" placeholder="Barcode" required />
  <input type="text" name="department" placeholder="Department" required />
  <input type="text" name="remarks" value="Available" readOnly /> {/* Read-only input for remarks */}
  <input type="number" name="quantity" placeholder="Quantity" required />
  <button type="submit">Add</button>
</form>
// ...existing code...
            )}
          </>
        )}
      </Sidebar>
      <TableContainer id="table-container">
        <Header>
          <Title>DIGITAL ACCESSION RECORDS</Title>
          <div style={{ position: 'relative' }}>
            <SearchBox
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {showRecommendations && (
              <RecommendationModal>
                {filteredData.map((item, index) => (
                  <RecommendationItem key={index} onClick={() => handleRecommendationClick(item)}>
                    {item.title} by {item.author}
                  </RecommendationItem>
                ))}
              </RecommendationModal>
            )}
            <HelpText>Help</HelpText>
          </div>
        </Header>
        <MenuBar>
          <span>☰</span>
          <span onClick={handleDownloadClick}>⬇</span>
        </MenuBar>
        <Table id="table">
          <thead>
            <tr>
              {columns.map((column) => (
                selectedColumns.includes(column) && <Th key={column}>{column}</Th>
              ))}
            </tr>
          </thead>
<tbody>
  {currentRows.map((row, index) => (
    <tr key={index}>
      {selectedColumns.includes('NUMBER') && <Td>{row.id}</Td>}
      {selectedColumns.includes('DATE RECEIVED') && <Td>{row.date_received}</Td>}
      {selectedColumns.includes('CLASS') && <Td>{row.class}</Td>}
      {selectedColumns.includes('AUTHOR') && <Td>{row.author}</Td>}
      {selectedColumns.includes('TITLE OF BOOK') && <Td>{row.title}</Td>}
      {selectedColumns.includes('EDITION') && <Td>{row.edition}</Td>}
      {selectedColumns.includes('VOLUME') && <Td>{row.volume}</Td>}
      {selectedColumns.includes('PAGES') && <Td>{row.pages}</Td>}
      {selectedColumns.includes('SOURCE OF FUND') && <Td>{row.record_of_source}</Td>}
      {selectedColumns.includes('COST PRICE') && <Td>{row.cost_price}</Td>}
      {selectedColumns.includes('PUBLISHER') && <Td>{row.publisher}</Td>}
      {selectedColumns.includes('YEAR') && <Td>{row.year}</Td>}
      {selectedColumns.includes('BARCODE') && <Td>{row.barcode}</Td>}
      {selectedColumns.includes('DEPARTMENT') && <Td>{row.department}</Td>}
      {selectedColumns.includes('REMARKS') && <Td>{row.remarks}</Td>}
      {selectedColumns.includes('QUANTITY') && <Td>{row.quantity}</Td>}
      <Td>
        <button onClick={() => handleEditClick(row)}>Edit</button>
      </Td>
    </tr>
  ))}
</tbody>
.
        </Table>
        <PaginationContainer>
          <PaginationButton onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</PaginationButton>
          <span>Page {currentPage} of {totalPages}</span>
          <PaginationButton onClick={handleNextPage} disabled={currentPage === totalPages}>Next</PaginationButton>
        </PaginationContainer>
      </TableContainer>
      <Modal isOpen={isModalOpen} onClose={handleModalClose} onConfirm={handleModalConfirm}>
        <p><strong>Date Received:</strong> {formData.dateReceived}</p>
        <p><strong>Class:</strong> {formData.class}</p>
        <p><strong>Author:</strong> {formData.author}</p>
        <p><strong>Title:</strong> {formData.title}</p>
        <p><strong>Edition:</strong> {formData.edition}</p>
        <p><strong>Volume:</strong> {formData.volume}</p>
        <p><strong>Pages:</strong> {formData.pages}</p>
        <p><strong>Record of Source:</strong> {formData.recordOfSource}</p>
        <p><strong>Cost Price:</strong> {formData.costPrice}</p>
        <p><strong>Publisher:</strong> {formData.publisher}</p>
        <p><strong>Year:</strong> {formData.year}</p>
        <p><strong>Barcode:</strong> {formData.barcode}</p>
        <p><strong>Program:</strong> {formData.department}</p>
        <p><strong>Remarks:</strong> {formData.remarks}</p>
        <p><strong>Quantity:</strong> {formData.quantity}</p>
      </Modal>
      <Modal isOpen={isPasswordModalOpen} onClose={handlePasswordModalClose} onConfirm={handlePasswordSubmit}>
        <p><strong>Enter Password to Download PDF:</strong></p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ced4da', borderRadius: '5px', fontSize: '16px', transition: 'border-color 0.3s' }}
          required
        />
      </Modal>
      <Modal isOpen={isEditPasswordModalOpen} onClose={() => setIsEditPasswordModalOpen(false)} onConfirm={handleEditPasswordSubmit}>
        <p><strong>Enter Password to Edit:</strong></p>
        <input
          type="password"
          value={editPassword}
          onChange={(e) => setEditPassword(e.target.value)}
          style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ced4da', borderRadius: '5px', fontSize: '16px', transition: 'border-color 0.3s' }}
          required
        />
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onConfirm={handleEditFormSubmit}>
        <form onSubmit={handleEditFormSubmit}>
          <input type="date" name="date_received" value={editFormData.date_received} onChange={handleEditFormChange} required />
          <input type="text" name="class" value={editFormData.class} onChange={handleEditFormChange} required />
          <input type="text" name="author" value={editFormData.author} onChange={handleEditFormChange} required />
          <input type="text" name="title" value={editFormData.title} onChange={handleEditFormChange} required />
          <input type="text" name="edition" value={editFormData.edition} onChange={handleEditFormChange} required />
          <input type="text" name="volume" value={editFormData.volume} onChange={handleEditFormChange} required />
          <input type="number" name="pages" value={editFormData.pages} onChange={handleEditFormChange} required />
          <input type="text" name="record_of_source" value={editFormData.record_of_source} onChange={handleEditFormChange} required />
          <input type="text" name="cost_price" value={editFormData.cost_price} onChange={handleEditFormChange} required />
          <input type="text" name="publisher" value={editFormData.publisher} onChange={handleEditFormChange} required />
          <input type="number" name="year" value={editFormData.year} onChange={handleEditFormChange} required />
          <input type="text" name="barcode" value={editFormData.barcode} onChange={handleEditFormChange} required />
          <input type="text" name="department" value={editFormData.department} onChange={handleEditFormChange} required />
          <input type="text" name="remarks" value={editFormData.remarks} readOnly />
          <input type="number" name="quantity" value={editFormData.quantity} onChange={handleEditFormChange} required />
          <button type="submit">Save</button>
        </form>
      </Modal>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={handleFilterModalClose}
        columns={columns}
        selectedColumns={selectedColumns}
        onColumnChange={handleColumnChange}
        onDateRangeChange={handleDateRangeChange}
      />
      <Chatbot />
    </Container>
  );
}

export default UserPage;