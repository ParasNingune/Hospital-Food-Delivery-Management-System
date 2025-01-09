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
  useToast,
} from "@chakra-ui/react";
import { FaClipboardList, FaTrashAlt } from "react-icons/fa";
import AdminDashboardSidebar from "./AdminDashboardSidebar";

const UsersPage = () => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const cardColor = useColorModeValue("white", "gray.800");

  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalActiveUsers, setTotalActiveUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  // Fetch Users Data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/all-users");
        const usersData = response.data;
        setUsers(usersData);
        setTotalUsers(usersData.length);
        setTotalActiveUsers(usersData.filter(user => user.status === "Active").length);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Open Modal with User Details
  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Close Modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Handle Deleting User
  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      setTotalUsers(totalUsers - 1);
      setTotalActiveUsers(users.filter(user => user.status === "Active").length);
      closeModal();
      toast({
        title: "User deleted.",
        description: "The user has been removed from the system.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error.",
        description: "There was an issue deleting the user.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <Flex height="100vh" bg={bgColor}>
      {/* Sidebar */}
      <AdminDashboardSidebar />

      {/* Main Content */}
      <Box flex="1" p={6} overflowY="auto">
        <Heading size="lg" mb={6}>
          Users Overview
        </Heading>

        {/* Recent Users */}
        <Box bg={cardColor} p={5} borderRadius="md" boxShadow="lg" mb={6}>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>User ID</Th>
                <Th>Role</Th>
                <Th>Details</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user._id}>
                  <Td>{capitalizeWords(user.name)}</Td>
                  <Td>{user._id}</Td>
                  <Td>{capitalizeWords(user.role)}</Td>
                  <Td>
                    <IconButton
                      colorScheme="teal"
                      aria-label="View User"
                      icon={<FaClipboardList />}
                      onClick={() => openModal(user)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Modal for User Details */}
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>User Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedUser ? (
                <Box>
                  {/* User Details Table */}
                  <Table variant="simple" mb={4}>
                    <Tbody>
                      <Tr>
                        <Th>Name</Th>
                        <Td>{capitalizeWords(selectedUser.name)}</Td>
                      </Tr>
                      <Tr>
                        <Th>User ID</Th>
                        <Td>{selectedUser._id}</Td>
                      </Tr>
                      <Tr>
                        <Th>User Role</Th>
                        <Td>{capitalizeWords(selectedUser.role)}</Td>
                      </Tr>
                      <Tr>
                        <Th>Email</Th>
                        <Td>{selectedUser.email}</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              ) : (
                <Text>Loading...</Text>
              )}
            </ModalBody>

            <ModalFooter>
              <ChakraButton
                colorScheme="red"
                mr={3}
                onClick={() => handleDeleteUser(selectedUser._id)}
              >
                <FaTrashAlt style={{ marginRight: "8px" }} />
                Delete User
              </ChakraButton>
              <ChakraButton colorScheme="blue" onClick={closeModal}>
                Close
              </ChakraButton>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Flex>
  );
};

export default UsersPage;
