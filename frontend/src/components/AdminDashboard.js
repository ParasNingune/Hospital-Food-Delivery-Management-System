import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button as ChakraButton,
  Heading,
  Text,
} from "@chakra-ui/react";
import { FaUsers, FaClipboardList, FaTruck, FaChartBar } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import AdminDashboardSidebar from "./admin/AdminDashboardSidebar";

const AdminDashboard = () => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const cardColor = useColorModeValue("white", "gray.800");

  const [orders, setOrders] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPendingOrders, setTotalPendingOrders] = useState(0);
  const [totalPantryStaff, setTotalPantryStaff] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visualizationData, setVisualizationData] = useState([]);

  // Fetch Orders and Map Patient Names
  useEffect(() => {
    const fetchOrdersAndPatients = async () => {
      try {
        // Fetch deliveries
        const orderResponse = await axios.get("http://localhost:5000/api/deliveries");
        const orders = orderResponse.data;

        // Fetch all patients
        const patientResponse = await axios.get("http://localhost:5000/api/patients");
        const patients = patientResponse.data;

        // Map patient names to orders
        const updatedOrders = orders.map((order) => {
          const patient = patients.find((p) => p._id === order.patientId);
          return { ...order, patientName: patient ? patient.name : "Unknown" };
        });

        const sortedOrders = updatedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setOrders(sortedOrders);
        setTotalOrders(sortedOrders.length);
        setTotalPendingOrders(sortedOrders.filter((order) => order.status !== "Delivered").length);

        const monthlyOrderCount = {};
        sortedOrders.forEach((order) => {
          const orderMonth = new Date(order.deliveryTime).toLocaleString("default", { month: "short" });
          if (monthlyOrderCount[orderMonth]) {
            monthlyOrderCount[orderMonth] += 1;
          } else {
            monthlyOrderCount[orderMonth] = 1;
          }
        });

        const formattedData = Object.keys(monthlyOrderCount).map((month) => ({
          name: month,
          orders: monthlyOrderCount[month],
        }));
        setVisualizationData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOrdersAndPatients();
  }, []);

  // Fetch Total Patients
  useEffect(() => {
    const fetchTotalPatients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/patients");
        setTotalPatients(response.data.length);
      } catch (error) {
        console.error("Error fetching total patients:", error);
      }
    };
    fetchTotalPatients();
  }, []);

  // Fetch Total Pantry Staff
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/all-users");
        setTotalPantryStaff(response.data.filter((user) => user.role === "pantry").length);
      } catch (error) {
        console.error("Error fetching pantry staff:", error);
      }
    };
    fetchUsers();
  }, []);

  // Open Modal with Order Details
  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const recentOrders = orders.slice(0, 5);

  return (
    <Flex height="100vh" bg={bgColor}>
      {/* Sidebar */}
      <AdminDashboardSidebar />

      {/* Main Content */}
      <Box flex="1" p={6} overflowY="auto">
        <Heading size="lg" mb={6}>
          Welcome to Admin Dashboard
        </Heading>

        {/* Summary Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={6}>
          <Stat bg={cardColor} p={5} borderRadius="md" boxShadow="lg">
            <StatLabel>Total Patients</StatLabel>
            <Flex alignItems="center" justifyContent="space-between">
              <StatNumber>{totalPatients}</StatNumber>
              <FaUsers size="24px" />
            </Flex>
          </Stat>

          <Stat bg={cardColor} p={5} borderRadius="md" boxShadow="lg">
            <StatLabel>Total Orders</StatLabel>
            <Flex alignItems="center" justifyContent="space-between">
              <StatNumber>{totalOrders}</StatNumber>
              <FaClipboardList size="24px" />
            </Flex>
          </Stat>

          <Stat bg={cardColor} p={5} borderRadius="md" boxShadow="lg">
            <StatLabel>Pending Deliveries</StatLabel>
            <Flex alignItems="center" justifyContent="space-between">
              <StatNumber>{totalPendingOrders}</StatNumber>
              <FaTruck size="24px" />
            </Flex>
          </Stat>

          <Stat bg={cardColor} p={5} borderRadius="md" boxShadow="lg">
            <StatLabel>Total Pantry Staff</StatLabel>
            <Flex alignItems="center" justifyContent="space-between">
              <StatNumber>{totalPantryStaff}</StatNumber>
              <FaChartBar size="24px" />
            </Flex>
          </Stat>
        </SimpleGrid>

        {/* Recent Orders */}
        <Box bg={cardColor} p={5} borderRadius="md" boxShadow="lg" mb={6}>
          <Heading size="md" mb={4}>
            Recent Orders
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Order ID</Th>
                <Th>Patient Name</Th>
                <Th>Status</Th>
                <Th>Details</Th>
              </Tr>
            </Thead>
            <Tbody>
              {recentOrders.map((order) => (
                <Tr key={order._id}>
                  <Td>{order._id}</Td>
                  <Td>{order.patientName}</Td>
                  <Td>{order.status}</Td>
                  <Td>
                    <IconButton
                      colorScheme="teal"
                      aria-label="View Order"
                      icon={<FaClipboardList />}
                      onClick={() => openModal(order)} // Open modal with order details
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Visualization Section */}
        <Box bg={cardColor} p={5} borderRadius="md" boxShadow="lg" mb={6}>
          <Heading size="md" mb={4}>
            Order Trends (Visualization)
          </Heading>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visualizationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Modal for Order Details */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Order Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedOrder ? (
                <Box>
                  {/* Order Details Table */}
                  <Table variant="simple" mb={4}>
                    <Tbody>
                      <Tr>
                        <Th>Order ID</Th>
                        <Td>{selectedOrder._id}</Td>
                      </Tr>
                      <Tr>
                        <Th>Patient Name</Th>
                        <Td>{selectedOrder.patientName}</Td>
                      </Tr>
                      <Tr>
                        <Th>Status</Th>
                        <Td>{selectedOrder.status}</Td>
                      </Tr>
                      <Tr>
                        <Th>Delivery Date</Th>
                        <Td>{new Date(selectedOrder.deliveryTime).toLocaleDateString()}</Td>
                      </Tr>
                      <Tr>
                        <Th>Delivery Time</Th>
                        <Td>{new Date(selectedOrder.deliveryTime).toLocaleTimeString()}</Td>
                      </Tr>
                    </Tbody>
                  </Table>

                  {/* Food Items Table */}
                  <Heading size="sm" mb={4}>Food Items</Heading>
                  {selectedOrder.foodItems && selectedOrder.foodItems.length > 0 ? (
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Item Name</Th>
                          <Th>Quantity</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {selectedOrder.foodItems.map((item, index) => (
                          <Tr key={index}>
                            <Td>{item.itemName}</Td>
                            <Td>{item.quantity}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <Text>No food items available.</Text>
                  )}
                </Box>
              ) : (
                <Text>Loading...</Text>
              )}
            </ModalBody>

            <ModalFooter>
              <ChakraButton colorScheme="blue" mr={3} onClick={closeModal}>
                Close
              </ChakraButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
};

export default AdminDashboard;
