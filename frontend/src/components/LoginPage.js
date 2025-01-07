
import React, { useState } from "react";
import { Box, Button, FormControl, FormLabel, Input, Stack, Heading, Text, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Make a POST request to your backend API to verify the user credentials
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      console.log(response)
      
      // Assuming the response contains a token and role
      const { token, role } = response.data;

      // Store the token in localStorage for future authentication
      localStorage.setItem("token", token);

      // Redirect based on the role
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "patient") {
        navigate("/patient-dashboard");
      } else if (role === "pantry") {
        navigate("/pantry-dashboard");
      }

      toast({
        title: "Login successful.",
        description: "You are being redirected to your dashboard.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Login failed.",
        description: "Invalid email or password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxWidth="400px"
      mx="auto"
      mt="100px"
      p={5}
      borderWidth={1}
      borderRadius="md"
      boxShadow="lg"
    >
      <Heading mb={4} textAlign="center">Login</Heading>
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

          <Button
            type="submit"
            colorScheme="teal"
            size="lg"
            width="full"
          >
            Login
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginPage;
