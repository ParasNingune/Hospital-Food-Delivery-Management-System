import React, { useState } from "react";
import { Input, Button, Box, FormControl, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate from react-router-dom

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");
  const navigate = useNavigate();  // Replace useHistory with useNavigate

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
      });
      if (response.status === 201) {
        navigate("/login"); // Use navigate to redirect after successful registration
      }
    } catch (err) {
      setError(err.response.data.message || "Error registering user");
    }
  };

  return (
    <Box maxW="lg" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <FormControl isInvalid={error}>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          mb={4}
        />
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          mb={4}
        />
        <FormLabel>Password</FormLabel>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          mb={4}
        />
        <FormLabel>Role</FormLabel>
        <Input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Enter user role (e.g. admin, pantry)"
          mb={4}
        />
        <FormErrorMessage>{error}</FormErrorMessage>
        <Button colorScheme="teal" onClick={handleRegister}>
          Register
        </Button>
      </FormControl>
    </Box>
  );
};

export default Register;
