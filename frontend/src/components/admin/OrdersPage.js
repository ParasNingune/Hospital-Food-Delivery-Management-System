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
  FormControl,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import { FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AdminDashboardSidebar from "./AdminDashboardSidebar";

const OrdersPage = () => {
  const navigate = useNavigate();

  const bgColor = useColorModeValue("gray.100", "gray.700");
  const cardColor = useColorModeValue("white", "gray.800");

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isAddOrderModalOpen, setIsAddOrderModalOpen] = useState(false);
  const [newOrderData, setNewOrderData] = useState({
    patientId: "",
    foodItems: [{ itemName: "", quantity: 1 }],
    deliveryTime: "",
  });
  const [patients, setPatients] = useState([]);

  // Fetch Orders and Patients
  useEffect(() => {
    const fetchOrdersAndPatients = async () => {
      try {
        const orderResponse = await axios.get("http://localhost:5000/api/deliveries");
        const orders = orderResponse.data;

        const patientResponse = await axios.get("http://localhost:5000/api/patients");
        const patients = patientResponse.data;

        const updatedOrders = orders.map((order) => {
          const patient = patients.find((p) => p._id === order.patientId);
          return { ...order, patientName: patient ? patient.name : "Unknown" };
        });

        const sortedOrders = updatedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setOrders(sortedOrders);
        setPatients(patients);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchOrdersAndPatients();
  }, []);

  // Open Modal with Order Details
  const openModal = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsOrderModalOpen(false);
    setSelectedOrder(null);
  };

  // Open Add Order Modal
  const openAddOrderModal = () => {
    setIsAddOrderModalOpen(true);
  };

  // Close Add Order Modal
  const closeAddOrderModal = () => {
    setIsAddOrderModalOpen(false);
    setNewOrderData({
      patientId: "",
      foodItems: [{ itemName: "", quantity: 1 }],
      deliveryTime: "",
    });
  };

  // Handle New Order Form Change
  const handleNewOrderChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === "patientId") {
      console.log("Patient ID selected:", value);
    }
    if (index !== null) {
      const updatedItems = [...newOrderData.foodItems];
      updatedItems[index][name] = value;
      setNewOrderData({ ...newOrderData, foodItems: updatedItems });
    } else {
      setNewOrderData({ ...newOrderData, [name]: value });
    }
  };

  const addFoodItem = () => {
    setNewOrderData({
      ...newOrderData,
      foodItems: [...newOrderData.foodItems, { itemName: "", quantity: 1 }],
    });
  };

  const removeFoodItem = (index) => {
    const updatedItems = newOrderData.foodItems.filter((_, i) => i !== index);
    setNewOrderData({ ...newOrderData, foodItems: updatedItems });
  };

  const handleAddOrderSubmit = async () => {
    if (!newOrderData.patientId) {
      alert("Please select a patient.");
      return;
    }
    
    try {
      // Add the new order
      console.log(newOrderData);
      await axios.post("http://localhost:5000/api/deliveries", newOrderData);
  
      // After success, navigate to the orders page
      navigate("/orders");
  
      // Close the modal
      closeAddOrderModal();
  
      // Update the orders list (optimistically)
      setOrders([...orders, newOrderData]);
    } catch (error) {
      console.error("Error adding order:", error);
    }
  };

  const recentOrders = orders;

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
                      onClick={() => openModal(order)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Modal for Order Details */}
        <Modal isOpen={isOrderModalOpen} onClose={closeModal}>
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

        {/* Modal for Adding New Order */}
        <Modal isOpen={isAddOrderModalOpen} onClose={closeAddOrderModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Order</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Patient</FormLabel>
              <Select
                name="patientId"
                value={newOrderData.patientId}
                onChange={handleNewOrderChange}
              >
                <option value="">Select a Person</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.name}
                  </option>
                ))}
              </Select>
            </FormControl>

              <FormControl mb={4}>
                <FormLabel>Delivery Time</FormLabel>
                <Input
                  type="datetime-local"
                  name="deliveryTime"
                  value={newOrderData.deliveryTime}
                  onChange={handleNewOrderChange}
                />
              </FormControl>

              <Box mb={4}>
                <FormLabel>Food Items</FormLabel>
                {newOrderData.foodItems.map((item, index) => (
                  <Flex key={index} mb={2} alignItems="center">
                    <Input
                      placeholder="Item Name"
                      name="itemName"
                      value={item.itemName}
                      onChange={(e) => handleNewOrderChange(e, index)}
                      mr={2}
                    />
                    <Input
                      type="number"
                      placeholder="Quantity"
                      name="quantity"
                      value={item.quantity}
                      onChange={(e) => handleNewOrderChange(e, index)}
                      mr={2}
                    />
                    <ChakraButton colorScheme="red" size="sm" onClick={() => removeFoodItem(index)}>
                      Remove
                    </ChakraButton>
                  </Flex>
                ))}
                <ChakraButton colorScheme="blue" size="sm" onClick={addFoodItem}>
                  Add Another Item
                </ChakraButton>
              </Box>
            </ModalBody>

            <ModalFooter>
              <ChakraButton colorScheme="blue" onClick={handleAddOrderSubmit}>
                Add Order
              </ChakraButton>
              <ChakraButton mr={3} onClick={closeAddOrderModal}>
                Cancel
              </ChakraButton>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Add New Order Button */}
        <ChakraButton 
          colorScheme="green" 
          onClick={openAddOrderModal} 
          position="absolute" 
          top="6" 
          right="6"
        >
          Add New Order
        </ChakraButton>
      </Box>
    </Flex>
  );
};

export default OrdersPage;
