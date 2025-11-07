/* eslint-disable react-hooks/rules-of-hooks */

import { useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Grow from "@mui/material/Grow";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { DeleteIcon, KebabMenuIcon, PencilSimple } from "../../../public/icons/icons";

export default function dropdownKebab({ emp, onEdit, onDelete }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const handleEditClick = () => {
        handleClose();
        onEdit(emp);
    };

    const handleDeleteClick = () => {
        handleClose();
        onDelete(emp._id);
    };

    return (
        <>
            {/* ปุ่มสามจุด */}
            <button
                onClick={handleClick}
                className="rounded-full hover:bg-slate-100 transition"
            >
                <KebabMenuIcon size={20} className="text-slate-500" />
            </button>

            {/* เมนูดรอปดาว */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Grow}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                    sx: {
                        borderRadius: 1.5,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        minWidth: 70,
                        mt: 0.5,
                        py: 0,
                    },
                }}
            >
                <MenuItem
                    onClick={handleEditClick}
                    sx={{
                        fontSize: "0.85rem",
                    }}
                >
                    <ListItemIcon>
                        <PencilSimple size={14} className="text-slate-500" />
                    </ListItemIcon>
                    <ListItemText primary="แก้ไข" />
                </MenuItem>
                <MenuItem
                    onClick={handleDeleteClick}
                    sx={{
                        fontSize: "0.85rem",
                    }}
                >
                    <ListItemIcon>
                        <DeleteIcon size={14} className="text-red-500" />
                    </ListItemIcon>
                    <ListItemText
                        primary="ลบ"
                        primaryTypographyProps={{ color: "error.main" }}
                    />
                </MenuItem>
            </Menu>
        </>
    );
}
