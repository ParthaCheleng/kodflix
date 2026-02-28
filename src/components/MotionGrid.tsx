"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

const variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

interface MotionGridProps {
    children: ReactNode;
    className?: string;
}

export default function MotionGrid({ children, className }: MotionGridProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
}
