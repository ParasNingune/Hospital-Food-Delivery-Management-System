import React from "react";
import { Box, Button, Heading, Text, Flex } from "@chakra-ui/react";
import { FaUsers, FaClipboardList, FaTruck, FaChartBar } from "react-icons/fa";

const AdminDashboardSidebar = () => {
  return (
    <Box
      width="250px"
      bg="teal.500"
      color="white"
      p={5}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box>
        <Heading size="lg" mb={6} textAlign="center">
          Admin Panel
        </Heading>
        <Flex direction="column" gap={4}>
          <Button variant="ghost" colorScheme="teal" justifyContent="start">
            Dashboard
          </Button>
          <Button variant="ghost" colorScheme="teal" justifyContent="start">
            Users
          </Button>
          <Button variant="ghost" colorScheme="teal" justifyContent="start">
            Diet Charts
          </Button>
          <Button variant="ghost" colorScheme="teal" justifyContent="start">
            Orders
          </Button>
          <Button variant="ghost" colorScheme="teal" justifyContent="start">
            Reports
          </Button>
          <Button variant="ghost" colorScheme="teal" justifyContent="start">
            Settings
          </Button>
        </Flex>
      </Box>
      <Text textAlign="center">© 2025 Hospital Management</Text>
    </Box>
  );
};

export default AdminDashboardSidebar;
