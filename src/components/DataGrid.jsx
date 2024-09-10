import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

const DataGrid = ({ apiUrl }) => {
    const [viewData, setViewData] = useState(null);
    const [expandedRows, setExpandedRows] = useState({});

    // Fetch data from API on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrl);
                setViewData(response.data);
            } catch (error) {
                console.error('Error fetching data', error);
            }
        };

        fetchData();
    }, [apiUrl]);

    const toggleRow = (id) => {
        setExpandedRows((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleMoreOptions = (id, action) => {
        switch (action) {
            case 'collapse':
            case 'expand':
                toggleRow(id);
                break;
            case 'delete':
                console.log(`Delete item with ID: ${id}`);
                break;
            case 'rename':
                console.log(`Rename item with ID: ${id}`);
                break;
            default:
                break;
        }
    };

    const renderRow = (node) => (
        <div key={node.id} className="border-b border-gray-200">
            <div className="flex items-center justify-between p-4">
                <div>
                    <div className="font-bold text-gray-800 truncate">{node.value}</div>
                    <div className="text-sm text-gray-600">{node.secondColumn}</div>
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => handleMoreOptions(node.id, expandedRows[node.id] ? 'collapse' : 'expand')}>
                        <MoreVertIcon className="text-gray-500 cursor-pointer hover:text-gray-700 transition-colors duration-200" />
                    </button>
                </div>
            </div>
            {node.hasSecondColumn && expandedRows[node.id] && (
                <div className="pl-4">
                    {node.nodes && node.nodes.map(renderRow)}
                </div>
            )}
        </div>
    );

    if (!viewData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        {viewData.headers.map((header, index) => (
                            <th key={index} className="px-4 py-2 border-b border-gray-200 text-left text-sm font-medium text-gray-700">
                                {header}
                            </th>
                        ))}
                        <th className="px-4 py-2 border-b border-gray-200 text-left text-sm font-medium text-gray-700">
                            Verdi
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {viewData.data && viewData.data.map((item) => (
                        <React.Fragment key={item.selectionId}>
                            {item.nodes && item.nodes.map(renderRow)}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataGrid;
