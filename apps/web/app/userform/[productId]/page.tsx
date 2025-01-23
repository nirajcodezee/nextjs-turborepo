"use client";

import { useParams } from "next/navigation";
import { Alert, Box, Card, CardContent, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { apiClient } from "../../../lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { Product } from "../../../types/Product";

export default function ProductId() {
    const { productId } = useParams();
    const { isPending, error, data: product } = useQuery<Product>({
        queryKey: ['products', productId],
        queryFn: () => apiClient.request(`/products/${productId}`, 'GET'),
    })

    if (isPending) return 'Loading...'

    if (error instanceof Error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Alert severity="error">{error.message}</Alert>
            </Box>
        );
    }
    return (
        <>
            <Box sx={{ flexGrow: 2, padding: 2, mt: 5 }} >
                <Grid container spacing={2} justifyContent={"center"}>
                    <Grid size={6}>
                        <Card sx={{ borderRadius: 2 }}>
                            <CardContent>
                                <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                    {product?.productTitle}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {product?.productDescription}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Category: {product?.category}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Brand: {product?.brand}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2 }}>
                                    ${product?.price}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Discount: {product?.discountPercentage}%
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Warranty: {product?.warranty}
                                </Typography>
                                <Typography variant="body2" color={product?.stockStatus === 'InStock' ? 'success.main' : 'error.main'}>
                                    {product?.stockStatus}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}