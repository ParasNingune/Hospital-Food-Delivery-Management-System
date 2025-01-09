import React from "react";
import { Box, Button, Heading, Text, Flex, Divider, Icon } from "@chakra-ui/react";
import { FaUsers, FaClipboardList, FaChartBar, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminDashboardSidebar = () => {
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Box
      width="220px"
      bg="gray.300" // Subtle background color
      color="gray.800"
      p={6}
      boxShadow="2xl"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      borderRight="1px solid #E2E8F0" // Subtle border for separation
    >
      <Box>
        {/* Logo and Heading */}
        <Heading
          size="lg"
          mb={8}
          textAlign="center"
          fontWeight="extrabold"
          letterSpacing="widest"
          color="teal.600"
        >
          Admin Panel
        </Heading>

        <Divider mb={6} borderColor="gray.300" />

        {/* Navigation Buttons */}
        <Flex direction="column" gap={4}>
          <Button
            variant="ghost"
            justifyContent="start"
            _hover={{ bg: "teal.100", color: "teal.700" }}
            onClick={() => handleNavigation("/admin-dashboard")}
            leftIcon={<Icon as={FaChartBar} />}
            fontSize="lg"
            fontWeight="medium"
            px={6}
            py={4}
            borderRadius="md"
          >
            Dashboard
          </Button>

          <Button
            variant="ghost"
            justifyContent="start"
            _hover={{ bg: "teal.100", color: "teal.700" }}
            onClick={() => handleNavigation("/users")}
            leftIcon={<Icon as={FaUsers} />}
            fontSize="lg"
            fontWeight="medium"
            px={6}
            py={4}
            borderRadius="md"
          >
            Users
          </Button>

          <Button
            variant="ghost"
            justifyContent="start"
            _hover={{ bg: "teal.100", color: "teal.700" }}
            onClick={() => handleNavigation("/orders")}
            leftIcon={<Icon as={FaClipboardList} />}
            fontSize="lg"
            fontWeight="medium"
            px={6}
            py={4}
            borderRadius="md"
          >
            Orders
          </Button>

          <Button
            variant="ghost"
            justifyContent="start"
            _hover={{ bg: "red.100", color: "red.600" }}
            onClick={handleLogout}
            leftIcon={<Icon as={FaSignOutAlt} />}
            fontSize="lg"
            fontWeight="medium"
            px={6}
            py={4}
            borderRadius="md"
          >
            Logout
          </Button>
        </Flex>
      </Box>

      {/* Footer */}
      <Box textAlign="center" mt={8}>
        <Divider mb={4} borderColor="gray.300" />
        <Text fontSize="xs" color="gray.500">
          © 2025 Hospital Management
        </Text>
      </Box>
    </Box>
  );
};

export default AdminDashboardSidebar;
