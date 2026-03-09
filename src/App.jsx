import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-primary-600 mb-4">MindCare AI</h1>
        <p className="text-lg text-slate-600">Tailwind CSS and Routing setup complete.</p>
      </div>
    </BrowserRouter>
  );
}

export default App;
