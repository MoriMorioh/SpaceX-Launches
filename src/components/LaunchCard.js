import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Card, Image, Text, Button, Center, Stack } from '@mantine/core';
import classes from './LaunchCard.module.css';
export const LaunchCard = ({ launch, onSelect }) => {
    const rawUrl = launch.links?.mission_patch_small || launch.links?.mission_patch || null;
    const [prevRawUrl, setPrevRawUrl] = useState(rawUrl);
    const [hasError, setHasError] = useState(false);
    if (prevRawUrl !== rawUrl) {
        setPrevRawUrl(rawUrl);
        setHasError(false);
    }
    const showImage = rawUrl && !hasError;
    return (_jsxs(Card, { className: classes.card, shadow: "sm", padding: "md", radius: "md", withBorder: true, children: [_jsx(Card.Section, { pt: "md", children: _jsx(Center, { className: classes.imageCenter, children: showImage ? (_jsx(Image, { src: rawUrl, alt: launch.mission_name, h: 100, w: "auto", fit: "contain", onError: () => setHasError(true) })) : (_jsx(Text, { c: "dimmed", size: "xs", children: "No Image" })) }) }), _jsxs(Stack, { className: classes.stack, justify: "space-between", mt: "md", children: [_jsxs(Stack, { gap: 4, align: "center", children: [_jsx(Text, { fw: 700, ta: "center", lineClamp: 1, children: launch.mission_name }), _jsx(Text, { size: "sm", c: "dimmed", ta: "center", children: launch.rocket?.rocket_name })] }), _jsx(Button, { fullWidth: true, color: "blue", radius: "md", onClick: () => onSelect(launch), children: "See more" })] })] }));
};
