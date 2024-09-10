import { Card, Typography } from '@mui/material';

function DataCards({ data }) {
    return (
        <div className="flex flex-col  w-56 ml-2 border border-sky-300">
            {data.length === 0 ? (
                <Typography>No data available</Typography>
            ) : (
                data.map((value, index) => (
                    <div key={index} className=" p-2 border-t">
                        <Typography variant="h6"> {value}</Typography>
                    </div>
                ))
            )}
        </div>
    );
}

export default DataCards;
