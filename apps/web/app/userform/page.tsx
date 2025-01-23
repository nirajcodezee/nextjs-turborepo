"use client";

import { Box, Container, IconButton, Modal, TextField, Typography } from "@mui/material";
import { useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import FormCarousel from "../../components/FormCarousel";
import ProductList from "../../components/ProductList";
import { Product } from "../../types/Product";
import { Button } from "@repo/shared-ui";

function BasicModal({ open, setOpen, currentUser, setCurrentUser }: any) {
  // Close the modal when the close button is clicked
  const handleClose = () => {
    setOpen(false)
    setCurrentUser(undefined)
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: '#333',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        hideBackdrop={true}
      >
        <Box sx={style}>
          <IconButton
            onClick={handleClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon sx={{ color: '#fff' }} />
          </IconButton>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ color: '#fff', mb: 2 }}
          >
            Product Title
          </Typography>
          <FormCarousel handleCloseModel={() => handleClose()} currentUser={currentUser} />
        </Box>
      </Modal>
    </div>
  );
}

const UserForm = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<Product | undefined>()
  const handleOpen = () => setOpen(true);

  return (
    <Container maxWidth="xl" sx={{ textAlign: "center", mt: 5 }}>
      <Box component="section" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "20px" }}>Product List</p>
        <BasicModal open={open} setOpen={setOpen} currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <Button
        label="Add Product"
        variant="contained"
        onClick={handleOpen}
      />
      </Box>
      <ProductList setOpen={setOpen} setCurrentUser={setCurrentUser} />
    </Container>
  )
}
export default UserForm