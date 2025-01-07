import React, { useState } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Stack,
  FormErrorMessage,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useToast,
  Select,
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginRegister = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      if (response.status === 200) {
        // Redirect user based on role
        navigate(`/${response.data.role.toLowerCase()}-dashboard`);
      }
    } catch (err) {
      setError(err.response.data.message || "Error logging in");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
      });
      if (response.status === 201) {
        toast({
          title: "Registration successful",
          description: "You can now log in.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsRegistering(false); // Switch to login tab
      }
    } catch (err) {
      setError(err.response.data.message || "Error registering user");
    }
  };

  return (
    <Box maxWidth="400px" mx="auto" mt="50px">
      {/* Toggle Buttons */}
      <Tabs variant="soft-rounded" isLazy>
        <TabList mb={4}>
          <Tab width="full" onClick={() => setIsRegistering(false)}>
            Login
          </Tab>
          <Tab width="full" onClick={() => setIsRegistering(true)}>
            Register
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {/* Login Form */}
            <Box
              p={5}
              borderWidth={1}
              borderRadius="md"
              boxShadow="lg"
            >
              <Heading mb={4} textAlign="center">
                Login
              </Heading>
              <form onSubmit={handleLogin}>
                <Stack spacing={4}>
                  <FormControl id="email" isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>

                  <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>

                  {error && <FormErrorMessage>{error}</FormErrorMessage>}

                  <Button type="submit" colorScheme="teal" size="lg" width="full">
                    Login
                  </Button>
                </Stack>
              </form>
            </Box>
          </TabPanel>

          <TabPanel>
            {/* Register Form */}
            <Box
              p={5}
              borderWidth={1}
              borderRadius="md"
              boxShadow="lg"
            >
              <Heading mb={4} textAlign="center">
                Register
              </Heading>
              <form onSubmit={handleRegister}>
                <Stack spacing={4}>
                  <FormControl id="name" isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormControl>

                  <FormControl id="email" isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>

                  <FormControl id="password" isRequired>
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>

                  {/* Role Dropdown */}
                  <FormControl id="role" isRequired>
                    <FormLabel>Role</FormLabel>
                    <Select
                      placeholder="Select role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="admin">Admin</option>
                      <option value="pantry">Pantry</option>
                      <option value="delivery">Delivery</option>
                    </Select>
                  </FormControl>

                  {error && <FormErrorMessage>{error}</FormErrorMessage>}

                  <Button type="submit" colorScheme="teal" size="lg" width="full">
                    Register
                  </Button>
                </Stack>
              </form>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default LoginRegister;
