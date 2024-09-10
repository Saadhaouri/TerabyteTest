import { useState } from 'react';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import FlagIcon from '@mui/icons-material/Flag';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { Card, InputAdornment, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { fetchDynamicTableData } from '../Api/fetchDynamicTableData';
import DataCards from './DataCards';

// Function to extract node IDs recursively
const extractNodeIds = (nodes) => {
    return nodes.map(node => node.id);
};

// Recursive function to render nodes with expand/collapse functionality
const renderNodes = (nodes, expandedNodeId, handleNodeToggle, handleNodeClick) => {
    return nodes.map(node => (
        <div key={node.id} className=" w-56">
            <div className="flex items-center ">
                <button
                    onClick={() => handleNodeToggle(node.id)}
                    className="flex items-center p-2 text-blue-600 hover:text-blue-800 focus:outline-none border-t w-full"
                >
                    {expandedNodeId === node.id ? (
                        <ExpandLessIcon fontSize="small" className="mr-2" />
                    ) : (
                        <ExpandMoreIcon fontSize="small" className="mr-2" />
                    )}
                    <span className="font-medium text-gray-800">{node.id}</span>
                </button>
                {/* Add a button to set the current node ID */}

            </div>

            {expandedNodeId === node.id && node.nodes && (
                <section className="pl-4 mt-2">
                    <ul className="list-disc pl-5">
                        {renderNodes(node.nodes, expandedNodeId, handleNodeToggle, handleNodeClick)}
                    </ul>
                </section>
            )}
        </div>
    ));
};

function DynamicTable() {
    const [expandedNodeId, setExpandedNodeId] = useState(null); // Store expanded node ID
    const [currentNodeId, setCurrentNodeId] = useState(null); // Store current node ID
    const [filters, setFilters] = useState({});
    const {
        isLoading,
        error,
        data: viewData,
    } = useQuery({
        queryKey: ['view'],
        queryFn: async () => {
            const response = await fetchDynamicTableData("da398447-5804-4901-957a-08dccff0be01");
            console.log(response); // Ensure the response has the 'data' field and its structure is correct
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

    // Set current node ID to display details
    const handleNodeClick = (nodeId) => {
        setCurrentNodeId(nodeId);
    };

    // Filter rows based on inputs
    const filteredData = viewData?.data?.filter(item =>
        Object.keys(filters).every(key => item[key]?.toString().toLowerCase().includes(filters[key]))
    );

    // Extract unique secondColumn values for the current node
    const getParentSecondColumnValues = (data) => {
        if (!Array.isArray(data)) {
            console.error("Expected data to be an array, but received:", data);
            return []; // Return an empty array if data is not an array
        }

        const secondColumnSet = new Set(); // Use a Set to ensure uniqueness

        // Iterate over each item in the data array
        data.forEach(item => {
            // Check if the item has nodes
            if (item.nodes && item.nodes.length > 0) {
                // Iterate over each node (parent node)
                item.nodes.forEach(node => {
                    if (node.hasSecondColumn && node.secondColumn) {
                        secondColumnSet.add(node.secondColumn); // Add the value to the Set
                    }
                });
            }
        });

        return Array.from(secondColumnSet); // Convert the Set to an array
    };

    const nodes = viewData?.data?.[0]?.nodes || [];
    const secondColumnValues = getParentSecondColumnValues(viewData?.data || []);

    return (
        <div className="flex flex-col space-y-4">
            {/* Header filter inputs */}
            <div className="flex space-x-1 p-4 rounded-lg bg-gray-50 border border-sky-600">
                <div className="flex-1 p-2 text-center rounded bg-gray-50">
                    <Typography className="mb-2 text-xs">Area</Typography>
                </div>
                {viewData?.headers.map((header) => (
                    <div key={header.accessorKey} className="flex-1 p-2 border text-center border-sky-600 rounded bg-gray-50">
                        <Typography variant="h6" className="mb-2">{header.name}</Typography>
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
                <div className="flex-1 p-2 border text-center rounded bg-gray-50">
                    <Typography variant="h6" className="mb-2">Verdi</Typography>
                    <TextField
                        className="bg-slate-70"
                        variant="outlined"
                        size="small"
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
            </div>

            {/* Data display cards */}
            <div className="flex flex-col p-4 space-y-4">
                {filteredData?.map((item) => (
                    <div key={item.id} className="flex flex-row space-x-4">
                        <Card className="shadow-lg border flex flex-col p-4 w-64">
                            <div className="flex items-center justify-between mb-4">
                                <h6 className="text-lg font-bold text-gray-800 truncate">{item.name.length > 14 ? `${item.name.slice(0, 14)}...` : item.name}</h6>
                                <MoreVertIcon fontSize='small' className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200" />
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-2 flex items-center justify-between">
                                    <span>{item.distributionKey?.name || 'N/A'}</span>
                                    <div className="flex space-x-2">
                                        <EditIcon fontSize='small' className="text-gray-400 cursor-pointer hover:text-blue-600 transition-colors duration-200" />
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
                        {item.nodes && (
                            <div className=' flex'>
                                <Card className="p-2 w-56 border">
                                    {renderNodes(item.nodes, expandedNodeId, handleNodeToggle, handleNodeClick)}
                                </Card>
                                <DataCards data={secondColumnValues} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DynamicTable;
