import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button as ChakraButton,
  Flex,
  Heading,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaClipboardList, FaTruck } from "react-icons/fa";
import Sidebar from "./pantry/PantrySideBar";
import { useNavigate } from "react-router-dom";

const PantryDashboard = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const cardColor = useColorModeValue("white", "gray.800");
  const [pendingOrders, setPendingOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPendingOrders, setTotalPendingOrders] = useState(0);

  useEffect(() => {
    const fetchOrdersAndPatients = async () => {
      try {
        // Fetch deliveries (orders)
        const orderResponse = await axios.get("http://localhost:5000/api/deliveries");
        const orders = orderResponse.data;

        // Fetch patients
        const patientResponse = await axios.get("http://localhost:5000/api/patients");
        const patients = patientResponse.data;

        // Map patient names to orders
        const updatedOrders = orders.map((order) => {
          const patient = patients.find((p) => p._id === order.patientId);
          return { ...order, patientName: patient ? patient.name : "Unknown" };
        });

        // Filter only delivered orders
        const filteredOrders = updatedOrders.filter((order) => order.status !== "Delivered");
        setTotalOrders(orders);
        setPendingOrders(filteredOrders);
        setTotalPendingOrders(filteredOrders.length)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOrdersAndPatients();
  }, []);

  const handleLogout = () => {
    navigate("/login");
  };

  const sidebarOptions = [
    {
      label: "Manage Orders",
      icon: FaClipboardList,
      onClick: () => navigate("/pantry-orders"),
    },
    {
      label: "Track Deliveries",
      icon: FaTruck,
      onClick: () => navigate("/pantry-deliveries"),
    },
  ];

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <Flex height="100vh" bg={bgColor}>
      {/* Sidebar */}
      <Sidebar title="Pantry Panel" options={sidebarOptions} onLogout={handleLogout} />

      {/* Main Content */}
      <Box flex="1" p={6} overflowY="auto">
        <Heading size="lg" mb={6}>
          Welcome to Pantry Dashboard
        </Heading>

        {/* Summary Cards */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6} mb={6}>
          <Stat bg={cardColor} p={5} borderRadius="md" boxShadow="lg">
            <StatLabel>Total Orders</StatLabel>
            <Flex alignItems="center" justifyContent="space-between">
              <StatNumber>{totalOrders.length}</StatNumber>
              <FaClipboardList size="24px" />
            </Flex>
          </Stat>

          <Stat bg={cardColor} p={5} borderRadius="md" boxShadow="lg">
            <StatLabel>Pending Orders</StatLabel>
            <Flex alignItems="center" justifyContent="space-between">
              <StatNumber>{totalPendingOrders}</StatNumber>
              <FaTruck size="24px" />
            </Flex>
          </Stat>
        </SimpleGrid>

        {/* Pending Orders Table */}
        <Box bg={cardColor} p={5} borderRadius="md" boxShadow="lg" mb={6}>
          <Heading size="md" mb={4}>
            Pending Orders
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
              {pendingOrders.map((order) => (
                <Tr key={order._id}>
                  <Td>{order._id}</Td>
                  <Td>{order.patientName}</Td>
                  <Td>{order.status}</Td>
                  <Td>
                    <IconButton
                      colorScheme="teal"
                      aria-label="View Order"
                      icon={<FaClipboardList />}
                      onClick={() => openModal(order)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
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

                  <Heading size="sm" mb={4}>
                    Food Items
                  </Heading>
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

export default PantryDashboard;
