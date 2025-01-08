import React from "react";
import { Box, Button, Heading, Text, Flex } from "@chakra-ui/react";
import { FaUsers, FaClipboardList, FaTruck, FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const AdminDashboardSidebar = () => {
  const navigate = useNavigate(); // Initialize navigate function

  // Handle navigation on button click
  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <Box
      width="250px"
      bg="teal.600"
      color="white"
      p={5}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      boxShadow="xl"
      height="100vh"
    >
      <Box>
        <Heading size="lg" mb={6} textAlign="center" fontWeight="bold" letterSpacing="wider">
          Admin Panel
        </Heading>

        <Flex direction="column" gap={4}>
          {/* Dashboard Button */}
          <Button
            variant="ghost"
            colorScheme="teal"
            justifyContent="start"
            _hover={{ bg: "teal.500", color: "white" }} // Ensure button text is white on hover
            onClick={() => handleNavigation("/admin-dashboard")}
            leftIcon={<FaChartBar />}
            fontSize="lg"
            fontWeight="medium"
            borderRadius="md"
            color="white" // Button text color
          >
            Dashboard
          </Button>

          {/* Users Button */}
          <Button
            variant="ghost"
            colorScheme="teal"
            justifyContent="start"
            _hover={{ bg: "teal.500", color: "white" }} // Ensure button text is white on hover
            onClick={() => handleNavigation("/users")}
            leftIcon={<FaUsers />}
            fontSize="lg"
            fontWeight="medium"
            borderRadius="md"
            color="white" // Button text color
          >
            Users
          </Button>

          {/* Orders Button */}
          <Button
            variant="ghost"
            colorScheme="teal"
            justifyContent="start"
            _hover={{ bg: "teal.500", color: "white" }} // Ensure button text is white on hover
            onClick={() => handleNavigation("/orders")}
            leftIcon={<FaClipboardList />}
            fontSize="lg"
            fontWeight="medium"
            borderRadius="md"
            color="white" // Button text color
          >
            Orders
          </Button>
        </Flex>
      </Box>

      {/* Footer */}
      <Text textAlign="center" mt={6} fontSize="sm" opacity={0.7}>
        © 2025 Hospital Management
      </Text>
    </Box>
  );
};

export default AdminDashboardSidebar;
