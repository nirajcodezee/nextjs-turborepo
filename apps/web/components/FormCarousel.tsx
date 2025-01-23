"use client";
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Box, Stepper, Step, StepLabel, Typography, TextField, Select, MenuItem, FormControl, InputLabel, FormControlLabel, FormHelperText, Stack, FormLabel, RadioGroup, Radio } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useForm, FormProvider, useFormContext, SubmitHandler } from "react-hook-form"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../lib/apiClient';
import { Button, FormTextField } from '@repo/shared-ui';
const steps = ['Product Information', 'Price and Stock', 'Shipping and Warranty Information'];

const formSchema = z.object({
    productTitle: z.string().min(1, 'Product title is required').max(50, 'Product title cannot exceed 50 characters'),
    productDescription: z.string().min(1, 'Product description is required').max(500, 'Product description cannot exceed 500 characters'),
    category: z.string().min(1, 'Category is required'),
    brand: z.string().min(1, 'Brand is required'),
    price: z
        .string()
        .min(1, 'Price must be greater than 0')
        .refine((val) => !isNaN(Number(val)), 'Price must be a valid number')
        .refine((val) => parseFloat(val) < 10000, 'Price must be less than 10,000'),
    discountPercentage: z.string().min(0, 'Discount cannot be negative').refine((val) => !isNaN(Number(val)), 'Discount must be a valid number')
        .refine((val) => parseFloat(val) < 10000, 'Discount must be less than 10,000').optional(),
    stockStatus: z.enum(["InStock", "OutOfStock"]),
    minimumOrderQuantity: z.number().min(1, "Minimum order quantity should be at least 1"),
    warranty: z.string().min(1, 'Warranty information is required'),
    shippingInfo: z.string().min(1, 'Shipping information is required'),
    returnPolicy: z.string().min(1, 'Return policy is required'),
})

interface IFormInput {
    id?: string;
    productTitle: string;
    productDescription: string;
    category: string;
    brand: string;
    price: string;
    discountPercentage?: string;
    stockStatus: "InStock" | "OutOfStock";
    minimumOrderQuantity: number;
    warranty: string;
    shippingInfo: string;
    returnPolicy: string;
}

// Personal Information Form (Step 1)
const ProductInformationForm = () => {
    const { register, formState: { errors }, watch } = useFormContext()

    return (
        <Stack
            direction="column"
            spacing={2}
            sx={{
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <FormTextField
                label="Product Title"
                name="productTitle"
                register={register}
                errors={errors}
            // control={control}
            />

            {/* <TextField
                error={Boolean(errors.productTitle)}
                label="Product Title"
                fullWidth
                variant="outlined"
                {...register('productTitle')}
                helperText={errors.productTitle?.message as string || ''}
            /> */}

            <TextField
                error={Boolean(errors.productDescription)}
                label="Product Description"
                fullWidth
                variant="outlined"
                {...register('productDescription')}
                helperText={errors.productDescription?.message as string || ''}
            />

            <FormControl fullWidth error={Boolean(errors.category)}>
                <InputLabel>Category</InputLabel>
                <Select
                    {...register('category')}
                    label="Category"
                    defaultValue={watch("category") || ""}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value="beauty">Beauty</MenuItem>
                    <MenuItem value="electronics">Electronics</MenuItem>
                    <MenuItem value="fashion">Fashion</MenuItem>
                    <MenuItem value="health">Health</MenuItem>
                    <MenuItem value="home">Home</MenuItem>
                </Select>
                <FormHelperText>{errors.category?.message as string || ""}</FormHelperText>
            </FormControl>

            <TextField
                error={Boolean(errors.brand)}
                label="Brand"
                fullWidth
                variant="outlined"
                {...register('brand')}
                helperText={errors.brand?.message as string || ''}
            />
        </Stack>
    )
}

// Price and Stock (Step 2)
const PriceAndStockForm = () => {
    const { register, formState: { errors }, watch } = useFormContext()
    console.log("PriceAndStockForm-errors", errors)
    return (
        <>
            <Stack
                direction="column"
                spacing={2}
                sx={{
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <TextField
                    error={Boolean(errors.price)}
                    label="Price"
                    fullWidth
                    helperText={errors.price?.message as string || ''}
                    {...register("price")}
                />

                <TextField
                    error={Boolean(errors.discountPercentage)}
                    label="Discount Percentage"
                    fullWidth
                    helperText={errors.discountPercentage?.message as string || ''}
                    {...register("discountPercentage")}
                />
                <FormControl fullWidth error={Boolean(errors.stockStatus)}>
                    <FormLabel>Stock Status</FormLabel>
                    <RadioGroup
                        row
                        defaultValue={watch("stockStatus") || "InStock"}
                    >
                        <FormControlLabel {...register('stockStatus')} value="InStock" control={<Radio />} label="In Stock" />
                        <FormControlLabel {...register('stockStatus')} value="OutOfStock" control={<Radio />} label="Out of Stock" />
                    </RadioGroup>
                    <FormHelperText>{errors.stockStatus?.message as string || ''}</FormHelperText>
                </FormControl>

                <TextField
                    error={Boolean(errors.minimumOrderQuantity)}
                    type="number"
                    label="Minimum Order Quantity"
                    defaultValue={1}
                    fullWidth
                    helperText={errors.minimumOrderQuantity?.message as string || ''}
                    {...register("minimumOrderQuantity", {
                        valueAsNumber: true,
                    })}
                />
            </Stack>

        </>
    )
};

// Shipping and Warranty Information (Step 3)
const ShippingAndWarrantyForm = () => {
    const { register, formState: { errors } } = useFormContext()
    return (
        <Stack
            direction="column"
            spacing={2}
            sx={{
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <TextField
                error={Boolean(errors.warranty)}
                label="Warranty"
                {...register("warranty")}
                placeholder="1 month warranty"
                defaultValue="1 month"
                fullWidth
                helperText={errors.warranty?.message as string || ''}
            />

            <TextField
                error={Boolean(errors.shippingInfo)}
                label="Shipping Information"
                {...register("shippingInfo")}
                placeholder="Ships in 1 month"
                defaultValue="1"
                fullWidth
                helperText={errors.shippingInfo?.message as string || ''}
            />

            <TextField
                error={Boolean(errors.returnPolicy)}
                label="Return Policy"
                {...register("returnPolicy")}
                placeholder='30 days return policy'
                defaultValue="30"
                fullWidth
                helperText={errors.returnPolicy?.message as string || ''}
            />
        </Stack>
    )
};

type Props = {
    handleCloseModel: () => void;
    currentUser: IFormInput
}
export default function FormCarousel(props: Props) {
    const { currentUser: product } = props
    const [activeStep, setActiveStep] = useState<number>(0);

    const methods = useForm<IFormInput>({
        defaultValues: product ?? undefined,
        mode: "onChange",
        resolver: zodResolver(formSchema),
    })

    const queryClient = useQueryClient()

    const addProduct = async (prodc: IFormInput) => {
        console.log("prodc", prodc)
        if (product) {
            return await apiClient.request<{ id: number }>(
                `/products/${product?.id}`,
                'PUT',
                prodc
            );
        } else {
            return await apiClient.request<{ id: number }>(
                '/products',
                'POST',
                { id: Date.now().toString(), ...prodc }
            );
        }
    }

    const { mutate: addPostmutation } = useMutation({
        mutationFn: addProduct,
        onMutate: async (newProduct) => {
            await queryClient.cancelQueries({ queryKey: ['products'] })
            const previousPostData = queryClient.getQueriesData({ queryKey: ['products'] })

            queryClient.setQueriesData({ queryKey: ['products'] }, (oldData: { data: IFormInput[] }) => {
                return {
                    ...oldData,
                    data: [...oldData.data, newProduct],
                };
            });

            // queryClient.setQueriesData({ queryKey: ['products'] }, (oldData: { data: IFormInput[] }) => {
            //     const productExists = oldData.data.some(product => product.id === newProduct.id);
            //     if (productExists) {
            //         return oldData.data.map(product =>
            //             product.id === newProduct.id ? { ...product, ...newProduct } : product
            //         );
            //     } else {
            //         return [...oldData.data, newProduct];
            //     }
            // });

            return previousPostData
        },
        onSuccess: () => {
            // if (product) {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            // }
            props.handleCloseModel()
            methods.reset()
        },
        onError() {
            queryClient.setQueriesData({ queryKey: ['products'] }, (oldData) => {
                return oldData ? { ...oldData, updated: true } : oldData;
            });
        },
    })

    const onSubmit: SubmitHandler<IFormInput> = (data) => addPostmutation(data)

    const handleNext = async () => {
        const completeStep1 = await methods.trigger(["productTitle", "productDescription", "category", "brand"]);
        if (activeStep === 0 && completeStep1) {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
        if (activeStep === 1) {
            const completeStep2 = await methods.trigger(["price", "discountPercentage", "stockStatus", "minimumOrderQuantity"]);
            if (completeStep2) setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const theme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: {
                            optional?: React.ReactNode;
                        } = {};
                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length ? (
                    <>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you're finished
                        </Typography>
                    </>
                ) : (
                    <>
                        {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
                        <Box sx={{ mb: 3, mt: 3 }}>
                            <FormProvider {...methods}>
                                <form onSubmit={methods.handleSubmit(onSubmit)}>
                                    {activeStep === 0 ? <ProductInformationForm /> :
                                        activeStep === 1 ? <PriceAndStockForm /> :
                                            activeStep === 2 ? <ShippingAndWarrantyForm /> :
                                                null}
                                    {/* {activeStep === 2 && <input type="submit" />} */}
                                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                        <Button
                                            color="inherit"
                                            disabled={activeStep === 0}
                                            onClick={handleBack}
                                            sx={{ mr: 1 }}
                                            label="Back"
                                        />
                                        {/* disabled={!methods.formState.isDirty || !methods.formState.isValid} */}
                                        <Box sx={{ flex: '1 1 auto' }} />
                                        {activeStep < 2 && <Button label='Next' onClick={() => handleNext()} />}
                                        {activeStep === 2 && <Button label='Submit' type='submit' />}
                                    </Box>
                                </form>
                            </FormProvider>
                        </Box>
                    </>
                )}
            </Box>
        </ThemeProvider>
    );
}