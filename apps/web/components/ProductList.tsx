"use client";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useState } from 'react'
import { apiClient } from '../lib/apiClient';
import { Product } from '../types/Product';
import { Card, CardContent, Typography, Box, Alert, TablePagination, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Button } from '@repo/shared-ui';


interface Pagination {
  data: Product[];
  first: number;
  items: number;
  last: number;
  next: number;
  pages: number;
  prev: number;
}
type Props = {
  setOpen?: Dispatch<SetStateAction<boolean>>;
  setCurrentUser?: Dispatch<SetStateAction<Product | undefined>>;
  // setOpen?: (value: boolean | ((prevVar: boolean) => boolean)) => void;
}
function ProductList(props: Props) {
  const { setOpen, setCurrentUser } = props
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const queryClient = useQueryClient()

  //simple call
  // const { isPending, error, data: products } = useQuery({
  //   queryKey: ['products'],
  //   queryFn: () => apiClient.request<Product[]>(`/products`, 'GET'),
  //   // staleTime:20000
  //   // refetchInterval:false || 1000
  // })

  // products pagination
  const { isPending, error, data } = useQuery({
    queryKey: ['products', page, rowsPerPage],
    queryFn: () => apiClient.request<Pagination>(`/products?_page=${page + 1}&_per_page=${rowsPerPage}`, 'GET'),
    placeholderData: keepPreviousData
  });
  const products = data?.data

  const handleChangePage = (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleDeleteClick = async (productId: string) => {
  //   setSelectedProductId(productId);
  //   setOpenDialog(true);
  // };

  // Close the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProductId(null);
  };

  // Confirm deletion
  const handleConfirmDelete = async (productId: string) => {
    return await apiClient.request(`/products/${productId}`, 'DELETE')
  }

  const { mutate: handleDeleteClick } = useMutation({
    mutationFn: handleConfirmDelete,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['products'] })
      const previousPostData = queryClient.getQueriesData({ queryKey: ['products'] })

      queryClient.setQueriesData({ queryKey: ['products'] }, (oldData: { data: Product[] }) => {
        return {
          ...oldData,
          data: oldData.data.filter((post: Product) => post.id !== postId),
        };
      });

      return previousPostData
    },
    onSuccess: () => {
      setOpenDialog(false);
      toast.success("Product deleted successfully.");
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
    },
  });


  if (isPending) return 'Loading...'

  if (error instanceof Error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Alert severity="error">{error.message}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={2} justifyContent="center">
        {products && products.map((product: Product, index) => (
          <Grid size={{ xs: 12, md: 4, sm: 6 }} key={index} >
            <Link href={`/userform/${product?.id}`}>
              <Card sx={{ borderRadius: 2, height: '100%', boxShadow: 3 }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                    {product.productTitle}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product.productDescription}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Category: {product.category}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Brand: {product.brand}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2 }}>
                    ${product.price}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Discount: {product.discountPercentage}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Warranty: {product.warranty}
                  </Typography>
                  <Typography variant="body2" color={product.stockStatus === 'InStock' ? 'success.main' : 'error.main'}>
                    {product.stockStatus}
                  </Typography>

                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 2,
                    gap: 1,
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center'
                  }}>
                    <Button
                      label="Update"
                      variant="contained"
                      color="primary"
                      onClick={(e) => {
                        e.preventDefault();
                        setOpen?.(true)
                        setCurrentUser?.(product)
                      }}
                      sx={{ width: { xs: '100%', sm: 'auto' } }}
                    />
                    <Button
                      label="Delete"
                      variant="outlined"
                      color="error"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedProductId(product?.id as string);
                        setOpenDialog(true);
                      }}
                      sx={{ width: { xs: '100%', sm: 'auto' } }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      {/* Dialog for Deleting Product */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button label='Cancel' onClick={handleCloseDialog} color="primary" />
          <Button label='Delete' onClick={() => {
            handleDeleteClick(selectedProductId as string);
          }} color="error" />
        </DialogActions>
      </Dialog>

      {/* Table pagination */}
      <TablePagination
        component="div"
        sx={{ justifyContent: "center", width: "100%", display: "flex", mt: 5 }}
        count={Number(data?.items || 0)}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[{ label: "5", value: 5 }, { label: "10", value: 10 }, { label: "20", value: 20 }]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  )
}

export default ProductList