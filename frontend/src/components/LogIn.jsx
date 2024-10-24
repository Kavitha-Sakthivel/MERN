import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Pages/Navbar";
import {
  Box,
  Button,
  Heading,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { loginFetch } from "../Redux/UserReducer/action";
import { Link, useNavigate } from "react-router-dom";
import { showToast } from "./SignUp";

const Login = () => {
  const emailInput = useRef(null);
  const backgroundRef = useRef(null);
  const emailbox = useRef(null);
  const passwordInput = useRef(null);
  const passwordbox = useRef(null);
  const [form, setForm] = useState({ email: "", password: "" });

  const userStore = useSelector((store) => store.UserReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  // Will show the input element when clicked on the element
  function showInput(e) {
    const ele = e.target.id;
    if (ele === "email") {
      emailInput.current.style.display = "block";
      emailInput.current.focus();
      emailbox.current.style.padding = "5px 20px";
    } else if (ele === "password") {
      passwordInput.current.style.display = "block";
      passwordInput.current.focus();
      passwordbox.current.style.padding = "5px 20px";
    }
  }

  // Will block the input element when clicked on the background
  function blockInput(event) {
    if (event.target === backgroundRef.current && !form.email) {
      emailInput.current.style.display = "none";
      emailbox.current.style.padding = "20px";
    }
    if (event.target === backgroundRef.current && !form.password) {
      passwordInput.current.style.display = "none";
      passwordbox.current.style.padding = "20px";
    }
  }

  // Form management
  function handleInput(e) {
    const { value, name } = e.target;
    if (name === "email") {
      setForm({ ...form, email: value });
    } else {
      setForm({ ...form, password: value });
    }
  }

  // Login function
  function handleLogin() {
    dispatch(loginFetch(form)).then((res) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.message) {
        showToast({ toast, message: 'Login Successful', color: 'green' });
        setForm({ email: "", password: "" });
      } else {
        showToast({ toast, message: userStore?.isError, color: 'red' });
      }
    });
  }

  useEffect(() => {
    // If isAuth is true, move to dashboard
    if (userStore.isAuth) {
      if (userStore?.role === 'user') {
        navigate("/home");
      } else if (userStore?.role === "admin") {
        navigate("/admin/dashboard");
      } else if (userStore?.role === 'teacher') {
        navigate("/TeacherDashboard");
      }
    }
  }, [userStore?.isAuth, userStore?.role, navigate]); // Added navigate to the dependency array

  return (
    <Box pb='2rem'>
      <Box>
        <Navbar />
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        pt="100px"
        onClick={blockInput}
        ref={backgroundRef}
      >
        <Box w={{ base: "90%", sm: "80%", md: "40%", lg: "30%" }}>
          <Box mt='15px'>
            <Heading size="md">Log in to your e-learning Account</Heading>
          </Box>
          {/* 2nd box  */}
          <Box mt="35px">
            <Box
              border="1px solid"
              p="20px"
              id="email"
              m="5px 0"
              onClick={showInput}
              ref={emailbox}
            >
              <Box>
                <Heading id="email" size="xs">Email</Heading>
              </Box>
              <Box>
                <Input
                  display="none"
                  ref={emailInput}
                  border="none"
                  p="0px"
                  focusBorderColor="transparent"
                  _focus={{ outline: "none" }}
                  name="email"
                  value={form.email}
                  onChange={handleInput}
                />
              </Box>
            </Box>
            {/* Password */}
            <Box
              border="1px solid"
              p="20px"
              id="password"
              m="5px 0"
              onClick={showInput}
              ref={passwordbox}
            >
              <Box>
                <Heading id="password" size="xs">Password</Heading>
              </Box>
              <Box>
                <Input
                  type="password"
                  display="none"
                  ref={passwordInput}
                  border="none"
                  size="sm"
                  focusBorderColor="transparent"
                  _focus={{ outline: "none" }}
                  name="password"
                  value={form.password}
                  onChange={handleInput}
                />
              </Box>
            </Box>
            <Box display='flex' m='1rem 0' fontSize='0.7rem'>
              <Text>You don't have an Account with us?</Text>
              <Link to='/signup'><Text _hover={{}} fontWeight='500' ml='0.5rem' color='black'>SignUp</Text></Link>
            </Box>
            {/* Button  */}
            <Box mt="15px">
              <Button
                w="100%"
                color="white"
                bg="#0056D2"
                _hover={{ background: "#1E88E5", color: "#CFD8DC" }}
                borderRadius="0"
                textAlign="center"
                onClick={handleLogin}
              >
                <Heading size="xs">
                  {userStore.loading ? <Spinner color="white" /> : "Log in"}
                </Heading>
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
