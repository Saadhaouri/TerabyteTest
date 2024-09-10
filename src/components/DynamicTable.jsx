import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { Card, InputAdornment, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import FlagIcon from '@mui/icons-material/Flag';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';

import { fetchDynamicTableData } from '../Api/fetchDynamicTableData';

// Function to extract node IDs recursively
const extractNodeIds = (nodes) => {
    return nodes.map(node => node.id);
};

// Recursive function to render nodes with expand/collapse functionality
const renderNodes = (nodes, expandedNodeId, handleNodeToggle) => {
    return nodes.map(node => (
        <div key={node.id} className="p-2 w-56 ">
            <div className="flex items-center">
                <button
                    onClick={() => handleNodeToggle(node.id)}
                    className="flex items-center text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                    {/* Toggle icon based on node expansion state */}
                    {expandedNodeId === node.id ? (
                        <ExpandLessIcon fontSize="small" className="mr-2" />
                    ) : (
                        <ExpandMoreIcon fontSize="small" className="mr-2" />
                    )}
                    <span className="font-medium text-gray-800">{node.id}</span>
                </button>
            </div>

            {/* Expand child nodes only for the clicked Node ID */}
            {expandedNodeId === node.id && node.nodes && (
                <section className="pl-4 mt-2">
                    <ul className="list-disc pl-5">
                        {renderNodes(node.nodes, expandedNodeId, handleNodeToggle)}
                    </ul>
                </section>
            )}
        </div>
    ));
};

function DynamicTable() {
    const [expandedNodeId, setExpandedNodeId] = useState(null); // Store expanded node ID
    const [filters, setFilters] = useState({});
    const {
        isLoading,
        error,
        data: viewData,
    } = useQuery({
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

    if (isLoading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>Error: {error.message}</Typography>;

    const handleFilterChange = (e, headerKey) => {
        setFilters({
            ...filters,
            [headerKey]: e.target.value.toLowerCase(),
        });
    };

    // Toggle the expansion of a specific node ID
    const handleNodeToggle = (nodeId) => {
        setExpandedNodeId((prevNodeId) => (prevNodeId === nodeId ? null : nodeId));
    };

    // Filter rows based on inputs
    const filteredData = viewData?.data.filter(item =>
        Object.keys(filters).every(key => item[key]?.toString().toLowerCase().includes(filters[key]))
    );

    return (
        <div className="flex flex-col space-y-4">
            {/* Header filter inputs */}
            <div className="flex space-x-1 p-4 rounded-lg">
                <div className="flex-1 p-2 border text-center border-sky-600 rounded bg-gray-50">
                    <Typography className="mb-2 text-xs">Area</Typography>
                </div>
                {viewData?.headers.map((header) => (
                    <div key={header.accessorKey} className="flex-1 p-2 border text-center border-sky-600 rounded bg-gray-50">
                        <Typography variant="h6" className="mb-2">{header}</Typography>
                        <TextField
                            className="bg-slate-70"
                            value={filters[header.accessorKey] || ""}
                            onChange={(e) => handleFilterChange(e, header.accessorKey)}
                            variant="outlined"
                            size="small"
                            placeholder={`Filter ${header.name}`}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Data display cards */}
            <div className="flex flex-col p-4 space-y-4">
                {filteredData?.map((item) => (
                    <div key={item.id} className="flex flex-row">
                        <Card className="shadow-lg border flex flex-col p-4 mb-4">
                            <div className="flex items-center justify-between mb-4">
                                <h6 className="text-lg font-bold text-gray-800 truncate w-36">
                                    {item.name.length > 14 ? `${item.name.slice(0, 14)}...` : item.name}
                                </h6>
                                <MoreVertIcon fontSize='small' className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200" />
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2 flex items-center justify-between">
                                    <span>{item.distributionKey?.name || 'N/A'}</span>
                                    <div className="flex space-x-2">
                                        <EditIcon fontSize='small' className="text-gray-400 text-[12px] cursor-pointer hover:text-blue-600 transition-colors duration-200" />
                                        <DeleteIcon fontSize='small' className="text-gray-400 cursor-pointer hover:text-red-600 transition-colors duration-200" />
                                    </div>
                                </p>
                                <p className="text-sm text-gray-500 mb-2 flex items-center">
                                    <div className='bg-green-600 rounded-full p-1 mr-1'></div>
                                    <span>{item.distributionKey?.name || 'N/A'}</span>
                                </p>
                            </div>
                            <p className="text-sm text-gray-500">
                                <FlagIcon /> Flag: {item.flag?.id || 'N/A'}
                            </p>
                        </Card>
                        {/* Render nodes for each item */}
                        {item.nodes && (
                            <Card className="mt-2  border p-4">
                                {renderNodes(item.nodes, expandedNodeId, handleNodeToggle)}
                            </Card>
                        )}

                    </div>

                ))}
            </div>
        </div>
    );
}

export default DynamicTable;
