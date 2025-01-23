import * as React from 'react';
import { MouseEventHandler, useCallback } from 'react';
import { Button as MuiButton, CircularProgress, ButtonProps } from '@mui/material';

interface CommonButtonProps extends ButtonProps {
    label: string;
    variant?: 'contained' | 'outlined' | 'text';
    type?: 'button' | 'submit' | 'reset';
    onClick?: MouseEventHandler<HTMLButtonElement>;
    isLoading?: boolean;
    progressSize?: number;
    progressThickness?: number;
    disabled?: boolean
}

export const Button: React.FC<CommonButtonProps> = ({
    color = 'primary',
    label,
    variant = 'contained',
    type = 'button',
    onClick,
    isLoading = false,
    progressSize = 14,
    progressThickness = 3,
    disabled=false,
    ...rest
}) => {

    const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
        async (event) => {
            if (onClick) {
                onClick(event);
            }

            if (event.defaultPrevented) {
                return;
            }

            if (type === 'submit') {
                event.stopPropagation();
            }
        },
        [onClick, type]
    );

    return (
        <MuiButton
            variant={variant}
            type={type}
            color={color}
            aria-label={label}
            disabled={disabled}
            onClick={handleClick}
            {...rest}
        >
            {isLoading && (
                <CircularProgress
                    sx={circularProgressStyle}
                    size={progressSize}
                    thickness={progressThickness}
                    color="inherit"
                />
            )}
            {label}
        </MuiButton>
    );
};

const circularProgressStyle = {
    '&.MuiCircularProgress-root': {
        marginRight: '10px',
        marginLeft: '2px',
    },
};
