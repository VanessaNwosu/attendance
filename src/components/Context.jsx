import React, { useState } from "react";
import { Container, Row, Col, Table, Form, Button, InputGroup } from "react-bootstrap";
// Assuming Sidebar is a separate component and is imported by your EmployeeTable
import Sidebar from "./Sidebar";


// Employee data - moved here to be used directly by EmployeeTable
const employees = [
  { id: 1, first: "Joshua", last: "Bakare", email: "josh.bakery@gmail.com", phone: "+2348012345678", role: "Admin" },
  { id: 2, first: "Jane", last: "Clement", email: "josh.bakery@gmail.com", phone: "+2348012345678", role: "Staff" },
  { id: 3, first: "Hannah", last: "Johnson", email: "hannah.j@gmail.com", phone: "+2348012345678", role: "Staff" },
  { id: 4, first: "John", last: "Ngoka", email: "john.n@gmail.com", phone: "+2348012345678", role: "Staff" },
  { id: 5, first: "Omotayo", last: "Adeleke", email: "omotayo.a@gmail.com", phone: "+2348012345678", role: "Staff" },
  { id: 6, first: "Gloria", last: "Amadi", email: "gloria.a@gmail.com", phone: "+2348012345678", role: "Staff" },
];

/**
 * EmployeeTable Component: Displays a list of employees with search, role change, and pagination.
 * This component integrates the filtering, searching, and pagination logic internally
 * to match the user's provided structure and the image's layout.
 */
function EmployeeTable() {
  // State for the search input field
  const [searchTerm, setSearchTerm] = useState('');
  // State for the selected role in the dropdown
  const [selectedRole, setSelectedRole] = useState('Change role');
  // State for the current page in pagination
  const [currentPage, setCurrentPage] = useState(1);
  // Number of employees to display per page
  const itemsPerPage = 5;

  // Filter employees based on the search term (case-insensitive)
  const filteredEmployees = employees.filter(emp =>
    emp.first.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.last.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.phone.includes(searchTerm) // Check if phone number includes the search term
  );

  // Calculate the total number of pages required for pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  // Determine the start and end index for slicing employees for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // Get the employees to display on the current page
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Handler for navigating to the previous page
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // Handler for navigating to the next page
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <>
      {/* Filter, Search, and Pagination Section - arranged for responsiveness */}
      <div className="d-flex flex-column flex-md-row align-items-center mb-4 gap-2">
        {/* Role Change Controls */}
        <Form.Select
          style={{ width: "150px" }} // Fixed width as per image
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="flex-shrink-0" // Prevents shrinking on smaller screens
        >
          <option>Change role</option>
          <option>Admin</option>
          <option>Staff</option>
          <option>Manager</option>
          <option>Supervisor</option>
        </Form.Select>
        <Button variant="success" className="flex-shrink-0">Change</Button>

        {/* Search Input Field with Bootstrap InputGroup */}
        <InputGroup className="flex-grow-1" style={{ maxWidth: "300px" }}> {/* Allows input to grow but with max width */}
          <Form.Control
            type="text"
            placeholder="Enter staff name here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Search icon - using Bootstrap Icons if available */}
          <Button variant="outline-secondary">
            <i className="bi bi-search"></i>
          </Button>
        </InputGroup>

        {/* Pagination Controls - Pushed to the right on medium and larger screens */}
        <div className="d-flex align-items-center ms-md-auto mt-2 mt-md-0">
          <Button variant="link" onClick={handlePreviousPage} disabled={currentPage === 1}>
            &lt; {/* HTML entity for less than sign */}
          </Button>
          <span className="text-muted mx-2">
            {` ${currentPage} of ${totalPages} `} {/* Current page and total pages display */}
          </span>
          <Button variant="link" onClick={handleNextPage} disabled={currentPage === totalPages}>
            &gt; {/* HTML entity for greater than sign */}
          </Button>
        </div>
      </div>

      {/* Employee Data Table */}
      <Table bordered hover responsive className="mb-4">
        <thead className="table-light"> {/* Light background for table header */}
          <tr>
            <th>
              <Form.Check /> {/* Checkbox for selecting all/none (logic not implemented) */}
            </th>
            <th>FIRST NAME</th>
            <th>LAST NAME</th>
            <th>EMAIL</th>
            <th>PHONE</th>
            <th>ROLE</th>
            <th></th> {/* Empty header for action icons */}
          </tr>
        </thead>
        <tbody>
          {currentEmployees.length > 0 ? (
            currentEmployees.map((emp) => (
              <tr
                key={emp.id} // Unique key for each row, important for React lists
                // Conditional styling for 'Jane' row as in original code
                style={{ backgroundColor: emp.first === "Jane" ? "#f1fdf5" : "white" }}
              >
                <td>
                  <Form.Check defaultChecked={emp.first === "Jane"} /> {/* Checkbox for individual row */}
                </td>
                <td>{emp.first}</td>
                <td>{emp.last}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.role}</td>
                <td>
                  <i className="bi bi-trash"></i> {/* Trash icon for delete action (Bootstrap Icons) */}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted py-4">No employees found.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </>
  );
}

/**
 * App Component: The main container that structures the entire dashboard layout.
 * It uses React Bootstrap's Grid system (Container, Row, Col) to replicate the image.
 */
export default function App() {
  return (
    // Main page wrapper with light background and minimum height
    <div className="bg-light min-vh-100 py-4">
      <Container className="bg-white p-4 rounded shadow-sm">
        {/* Header Section: "Employees" title and "Add New" button */}
        <Row className="mb-4 pb-3 border-bottom d-flex align-items-center">
          <Col>
            <h1 className="h3">Employees</h1> {/* Bootstrap heading class */}
          </Col>
          <Col xs="auto"> {/* Auto width column for the button */}
            <Button variant="success">Add New</Button>
          </Col>
        </Row>

        {/* Bakery Info Section: "Josh Bakery Ventures" and address */}
        <Row className="bg-light p-3 rounded mb-4 d-flex align-items-center">
          <Col className="text-start">
            <span className="fw-bold">Josh Bakery Ventures</span> {/* Bold text */}
          </Col>
          <Col xs="auto" className="text-end text-muted"> {/* Right-aligned muted text */}
            62 . Bode Thomas . Surulere , Lagos
          </Col>
        </Row>

        {/* The EmployeeTable component, which now contains its own controls */}
        <Row>
          <Col>
            <EmployeeTable />
          </Col>
        </Row>
      </Container>
    </div>
  );
}