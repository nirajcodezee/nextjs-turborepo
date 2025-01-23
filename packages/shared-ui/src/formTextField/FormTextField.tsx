"use client";
import React from 'react';
import {FieldErrors, FieldValues, UseControllerProps, UseFormRegister } from 'react-hook-form';
import { TextField, InputProps } from '@mui/material';

interface FormTextFieldProps extends InputProps{
    label?: string;
    name: string;
    register: UseFormRegister<any>;
    // control: any;
    errors: FieldErrors<FieldValues> | any;
    fullWidth?: boolean;
    variant?: 'outlined' | 'filled' | 'standard';
}

export function FormTextField({
    label,
    name,
    errors,
    fullWidth = true,
    variant = 'outlined',
    register
}:FormTextFieldProps ) {
    return (
        <>
            <TextField
                error={Boolean(errors[name])}
                label={label}
                fullWidth={fullWidth}
                variant={variant}
                {...register(name)}
                helperText={errors[name]?.message as string}
            />
        </>
    );
};

