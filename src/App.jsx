import './App.css'


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DynamicTable from './components/DynamicTable';


const queryClient = new QueryClient();

function App() {


  return (
    <>
      <QueryClientProvider client={queryClient}>


        <div>




          <DynamicTable />


          {/* <DTable /> */}
        </div>



      </QueryClientProvider>

    </>
  )
}

export default App
