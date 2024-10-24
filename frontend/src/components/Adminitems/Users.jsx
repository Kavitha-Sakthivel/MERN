import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  Select,
  Text,
  IconButton,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { deleteUsers, getUser } from "../../Redux/AdminReducer/action";
import Pagination from "./Pagination";
import AdminNavTop from "../AdminNavTop";

const Users = () => {
  const store = useSelector((store) => store.AdminReducer.users);
  const dispatch = useDispatch();
  
  // Add this useState hook for search
  const [ setSearch] = useState(""); 
  const [page, setPage] = useState(1);
  const [ setOrder] = useState(""); // Order is used, so it's retained
  const limit = 4;

  // Handle search input change
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Handle select order change
  const handleSelect = (e) => {
    const { value } = e.target;
    setOrder(value);
  };

  // Fetch users when page or order changes
  useEffect(() => {
    dispatch(getUser(page, limit));
  }, [page, dispatch]); // Added dispatch to the dependency array

  // Handle delete user
  const handleDelete = (id, name) => {
    dispatch(deleteUsers(id));
    alert(`${name} is deleted.`);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const count = 2;

  const handlePageButton = (val) => {
    setPage((prev) => prev + val);
  };

  return (
    <Grid className="Nav" h={"99vh"} w="94%" gap={10}>
      <Box mt='80px'>
        <AdminNavTop handleSearch={handleSearch} />
        <Box>
          <Grid
            templateColumns={{
              xl: "repeat(3,20% 60% 20%)",
              lg: "repeat(3,20% 60% 20%)",
              base: "repeat(1,1fr)",
            }}
            gap={{ xl: 0, lg: 0, base: 7 }}
            m={3}
          >
            <Text fontWeight={"bold"}>User Details</Text>
            <Select w={"80%"} onChange={handleSelect}>
              <option value="asc">Age Sort in Ascending Order</option>
              <option value="desc">Age Sort in Descending Order</option>
            </Select>
            <Box fontWeight={"bold"}>
              <Link to="/admin/users/add">Create</Link>
            </Box>
          </Grid>
          <Box
            w={{ xl: "100%", lg: "90%", md: "80%", base: "80%" }}
            maxWidth="100%"
            overflowX="auto"
          >
            <Table variant="striped" borderRadius="md" w="100%">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Role</Th>
                  <Th>Email</Th>
                  <Th>City</Th>
                  <Th>Age</Th>
                  <Th>Subscribed Course</Th>
                </Tr>
              </Thead>
              {store?.length > 0 &&
                store?.map((el, i) => {
                  return (
                    <Tbody key={i}>
                      <Tr>
                        <Td>{el.name}</Td>
                        <Td>{el.role}</Td>
                        <Td>{el.email}</Td>
                        <Td>{el.city}</Td>
                        <Td>{el.age}</Td>
                        <Td>{el.course.length}</Td>
                        <Box>
                          <Button onClick={() => handleDelete(el._id, el.name)}>
                            Delete
                          </Button>
                          <Link to={`/admin/users/edit/${el._id}`}>
                            <ButtonGroup size="sm" isAttached variant="outline">
                              <Button>Edit</Button>
                              <IconButton
                                aria-label="Edit user"
                                icon={<EditIcon />}
                              />
                            </ButtonGroup>
                          </Link>
                        </Box>
                      </Tr>
                    </Tbody>
                  );
                })}
            </Table>
          </Box>
          <Box textAlign={{ xl: "right", lg: "right", base: "left" }}>
            <Button disabled={page <= 1} onClick={() => handlePageButton(-1)}>
              Prev
            </Button>
            <Pagination
              totalCount={count}
              current_page={page}
              handlePageChange={handlePageChange}
            />
            <Button disabled={page >= count} onClick={() => handlePageButton(1)}>
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default Users;
