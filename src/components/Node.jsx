import React from 'react';
import { Typography, Divider } from '@mui/material';

const Node = ({ node }) => {
    if (!node.nodes || node.nodes.length === 0) {
        return (
            <div className="bg-white shadow-md p-2 rounded-lg">
                <Typography variant="body2">{node.value}</Typography>
                <Typography variant="caption" color="textSecondary">{node.secondColumn}</Typography>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md p-2 rounded-lg">
            <div className="flex items-center justify-between">
                <Typography variant="body2">{node.value}</Typography>
                {node.secondColumn && (
                    <Typography variant="caption" color="textSecondary">{node.secondColumn}</Typography>
                )}
            </div>
            <Divider className="my-2" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {node.nodes.map((childNode) => (
                    <Node key={childNode.id} node={childNode} />
                ))}
            </div>
        </div>
    );
};
