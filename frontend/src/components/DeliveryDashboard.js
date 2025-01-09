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
  Spinner,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber
} from "@chakra-ui/react";
import { FaClipboardList } from "react-icons/fa";
import DeliverySidebar from "./delivery/DeliverySidebar"

const DeliveryDashboard = () => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const cardColor = useColorModeValue("white", "gray.800");

  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch Deliveries
  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/deliveries");
      setDeliveries(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  // Open Modal with Delivery Details
  const openModal = (delivery) => {
    setSelectedDelivery(delivery);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDelivery(null);
  };

  // Prepare the statistics for the dashboard
  const totalDeliveries = deliveries.length;
  const completedDeliveries = deliveries.filter((delivery) => delivery.status === "Delivered").length;
  const pendingDeliveries = deliveries.filter((delivery) => delivery.status === "Pending").length;

  return (
    <Flex height="100vh" bg={bgColor}>
      {/* Sidebar */}
      <DeliverySidebar />

      {/* Main Content */}
      <Box flex="1" p={6} overflowY="auto">
        <Heading size="lg" mb={6}>
        Welcome to Delivery Dashboard
        </Heading>

        {/* Delivery Statistics */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6} mb={6}>
          <Stat bg={cardColor} p={5} borderRadius="md" boxShadow="lg">
            <StatLabel>Total Deliveries</StatLabel>
              <Flex alignItems="center" justifyContent="space-between">
                <StatNumber>{totalDeliveries}</StatNumber>
                <FaClipboardList size="24px" />
              </Flex>
          </Stat>
          <Stat bg={cardColor} p={5} borderRadius="md" boxShadow="lg">
            <StatLabel>Pending Deliveries</StatLabel>
              <Flex alignItems="center" justifyContent="space-between">
                <StatNumber>{pendingDeliveries}</StatNumber>
                <FaClipboardList size="24px" />
              </Flex>
          </Stat>

          <Stat bg={cardColor} p={5} borderRadius="md" boxShadow="lg">
            <StatLabel>Completed Deliveries</StatLabel>
              <Flex alignItems="center" justifyContent="space-between">
                <StatNumber>{completedDeliveries}</StatNumber>
                <FaClipboardList size="24px" />
              </Flex>
          </Stat>
        </SimpleGrid>

        {/* Pending Deliveries */}
        <Box bg={cardColor} p={5} borderRadius="md" boxShadow="lg" mb={6}>
          <Heading size="md" mb={4}>Recent Deliveries</Heading>
          {loading ? (
            <Flex justify="center" align="center">
              <Spinner size="xl" />
            </Flex>
          ) : (
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Delivery ID</Th>
                  <Th>Delivery Time</Th>
                  <Th>Status</Th>
                  <Th>Details</Th>
                </Tr>
              </Thead>
              <Tbody>
                {deliveries.slice(0, 5).map((delivery) => (
                    <Tr key={delivery._id}>
                      <Td>{delivery._id}</Td>
                      <Td>{new Date(delivery.deliveryTime).toLocaleString()}</Td>
                      <Td>{delivery.status}</Td>
                      <Td>
                        <IconButton
                          colorScheme="teal"
                          aria-label="View Delivery"
                          icon={<FaClipboardList />}
                          onClick={() => openModal(delivery)} // Open modal with delivery details
                        />
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          )}
        </Box>

        {/* Modal for Delivery Details */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delivery Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedDelivery ? (
                <Box>
                  {/* Delivery Details Table */}
                  <Table variant="simple" mb={4}>
                    <Tbody>
                      <Tr>
                        <Th>Delivery ID</Th>
                        <Td>{selectedDelivery._id}</Td>
                      </Tr>
                      <Tr>
                        <Th>Patient Name</Th>
                        <Td>{selectedDelivery.patientName}</Td>
                      </Tr>
                      <Tr>
                        <Th>Status</Th>
                        <Td>{selectedDelivery.status}</Td>
                      </Tr>
                      <Tr>
                        <Th>Delivery Date</Th>
                        <Td>{new Date(selectedDelivery.deliveryTime).toLocaleDateString()}</Td>
                      </Tr>
                      <Tr>
                        <Th>Delivery Time</Th>
                        <Td>{new Date(selectedDelivery.deliveryTime).toLocaleTimeString()}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
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

export default DeliveryDashboard;
