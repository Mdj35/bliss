import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Header, Title, Title1, SearchBox, HelpText, MenuBar, Sidebar, TableContainer, Table, Th, Td, UserInfo, MenuItem, RecommendationItem, RecommendationModal, Navbar, NavbarIcon } from "../design/homepagedesign";

function UserPage() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isDashboardVisible, setIsDashboardVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from PHP API
    const fetchData = async () => {
      const response = await fetch('https://vynceianoani.helioho.st/bliss/getbook.php');
      const data = await response.json();
      setTableData(data);
      setFilteredData(data);
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

  const handleAddMaterialsClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newData = {
      number: formData.get('id'),
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

    // Send data to PHP API
    const response = await fetch('https://vynceianoani.helioho.st/bliss/addbook.php', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      setTableData([...tableData, newData]);
      setFilteredData([...tableData, newData]);
      setShowDropdown(false);
    } else {
      console.error('Failed to add data');
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = tableData.filter((row) =>
      row.title.toLowerCase().includes(value.toLowerCase()) ||
      row.author.toLowerCase().includes(value.toLowerCase())
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

  return (
    <Container>
      <Sidebar visible={isDashboardVisible}>
        <Navbar>
          <Title1 visible={isDashboardVisible}>DASHBOARD</Title1>
          <NavbarIcon onClick={toggleDashboard} />
        </Navbar>
        {isDashboardVisible && (
          <>
            <UserInfo>🔵 NAME OF THE USER</UserInfo>
            <MenuItem>FILTERED BY:</MenuItem>
            <MenuItem onClick={handleAddMaterialsClick}>ADD MATERIALS</MenuItem>
            {showDropdown && (
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
             <input type="text" name="remarks" placeholder="Remarks" required />
             <input type="number" name="quantity" placeholder="Quantity" required />
             <button type="submit">Add</button>
           </form>
            )}
          </>
        )}
      </Sidebar>
      <TableContainer>
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
          <span>⬇</span>
        </MenuBar>
        <Table>
  <thead>
    <tr>
      <Th>NUMBER</Th>
      <Th>DATE RECEIVED</Th>
      <Th>CLASS</Th>
      <Th>AUTHOR</Th>
      <Th>TITLE OF BOOK</Th>
      <Th>EDITION</Th>
      <Th>VOLUME</Th>
      <Th>PAGES</Th>
      <Th>SOURCE OF FUND</Th>
      <Th>COST PRICE</Th>
      <Th>PUBLISHER</Th>
      <Th>YEAR</Th>
      <Th>BARCODE</Th>
      <Th>DEPARTMENT</Th>
      <Th>REMARKS</Th>
      <Th>QUANTITY</Th>
    </tr>
  </thead>
  <tbody>
    {filteredData.map((row, index) => (
      <tr key={index}>
        <Td>{row.id}</Td>
        <Td>{row.date_received}</Td>
        <Td>{row.class}</Td>
        <Td>{row.author}</Td>
        <Td>{row.title}</Td>
        <Td>{row.edition}</Td>
        <Td>{row.volume}</Td>
        <Td>{row.pages}</Td>
        <Td>{row.record_of_source}</Td>
        <Td>{row.cost_price}</Td>
        <Td>{row.publisher}</Td>
        <Td>{row.year}</Td>
        <Td>{row.barcode}</Td>
        <Td>{row.department}</Td>
        <Td>{row.remarks}</Td>
        <Td>{row.quantity}</Td>
      </tr>
    ))}
  </tbody>
</Table>
      </TableContainer>
    </Container>
  );
}

export default UserPage;