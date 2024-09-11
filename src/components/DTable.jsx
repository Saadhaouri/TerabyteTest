import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Typography, CircularProgress } from '@mui/material';
import { fetchDynamicTableData } from '../Api/fetchDynamicTableData';
import { Divider } from '@mui/material';

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

const DTable = () => {
    const [filters, setFilters] = useState({});
    const { isLoading, error, data } = useQuery({
        queryKey: ['view'],
        queryFn: async () => {
            const response = await fetchDynamicTableData("da398447-5804-4901-957a-08dccff0be01");
            return response;
        },
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });

    if (isLoading) return <CircularProgress />;
    if (error) return <Typography color="error">Error: {error.message}</Typography>;

    if (!data || !data.data || data.data.length === 0) {
        return <Typography>No data available</Typography>;
    }

    return (
        <div className="p-4">
            {data.data.map((item) => (
                <div key={item.selectionId}>
                    <Typography variant="h6">{item.name}</Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4 mt-4">
                        {item.nodes.map((node) => (
                            <Node key={node.id} node={node} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DTable;
