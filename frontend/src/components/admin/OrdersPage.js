import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Flex,
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
import { FaClipboardList } from "react-icons/fa";
import AdminDashboardSidebar from "./AdminDashboardSidebar";

const OrdersPage = () => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const cardColor = useColorModeValue("white", "gray.800");

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch Orders and Map Patient Names
  useEffect(() => {
    const fetchOrdersAndPatients = async () => {
      try {
        // Fetch deliveries (orders)
        const orderResponse = await axios.get("http://localhost:5000/api/deliveries");
        const orders = orderResponse.data;

        // Fetch all patients
        const patientResponse = await axios.get("http://localhost:5000/api/patients");
        const patients = patientResponse.data;

        // Map patient names to orders
        const updatedOrders = orders.map((order) => {
          const patient = patients.find((p) => p._id === order.patientId);
          return { ...order, patientName: patient ? patient.name : "Unknown" }; // Assign patient name
        });

        // Sort orders by the createdAt field in descending order
        const sortedOrders = updatedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setOrders(sortedOrders);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOrdersAndPatients();
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

  // Prepare recent orders for display (limit to 5)
  const recentOrders = orders.slice(0, 5);

  return (
    <Flex height="100vh" bg={bgColor}>
      {/* Sidebar */}
      <AdminDashboardSidebar />

      {/* Main Content */}
      <Box flex="1" p={6} overflowY="auto">
        <Heading size="lg" mb={6}>
          Orders Overview
        </Heading>

        {/* Recent Orders */}
        <Box bg={cardColor} p={5} borderRadius="md" boxShadow="lg" mb={6}>
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

export default OrdersPage;
