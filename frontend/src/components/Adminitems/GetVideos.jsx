import {
  Box,
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Removed useNavigate
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import convertDateFormat, { deleteProduct, getvideo } from "../../Redux/AdminReducer/action";
import Pagination from "./Pagination";
import AdminNavTop from "../AdminNavTop";

const GetVideos = () => {
  const store = useSelector((store) => store.AdminReducer.videos);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const limit = 4;

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  // Fetch videos based on page, limit, and user
  useEffect(() => {
    dispatch(getvideo(page, limit, user));
  }, [page, limit, user, dispatch]); // Added dispatch and user to dependencies

  // Handle deleting a video
  const handleDelete = (id, title) => {
    dispatch(deleteProduct(id));
    alert(`${title} is Deleted`);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setPage(page);
  };

  const count = Math.ceil(store.length / limit);

  const handlePageButton = (val) => {
    setPage((prev) => prev + val);
  };

  return (
    <Grid className="Nav" h={"99vh"} w="94%" gap={10}>
      <Box mt="80px">
        <AdminNavTop />
        <Box>
          <Text fontWeight={"bold"} m={5}>
            Courses Video
          </Text>

          <Box maxWidth="100%" overflowX="auto">
            <Table variant="striped" borderRadius="md" w="100%">
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Uploaded</Th>
                  <Th>Description</Th>
                  <Th>Views</Th>
                  <Th>Link</Th>
                  <Th>Actions</Th> {/* Added for delete/edit actions */}
                </Tr>
              </Thead>
              {store.length > 0 &&
                store.map((el, i) => {
                  return (
                    <Tbody key={i}>
                      <Tr>
                        <Td>{el.title}</Td>
                        <Td>{convertDateFormat(el.createdAt)}</Td>
                        <Td>{el.description}</Td>
                        <Td>{el.views}</Td>
                        <Td>{el.link}</Td>
                        <Box>
                          <Button onClick={() => handleDelete(el._id, el.title)}>
                            Delete
                          </Button>
                          <Link to={`/admin/videos/add/${el.courseId}`}>
                            <ButtonGroup size="sm" isAttached variant="outline">
                              <Button>Add</Button>
                              <IconButton
                                aria-label="Add to friends"
                                icon={<AddIcon />}
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

export default GetVideos;
