import WorkTimeCalculator from './components/WorkTimeCalculator'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">Work Time Calculator</h1>
      </header>
      <div className="flex-grow container mx-auto px-4 py-8">
        <WorkTimeCalculator />
      </div>
      <footer className="bg-gray-200 text-center p-4 text-sm text-gray-600">
        <p>Calculations are approximate and for guidance only.</p>
      </footer>
    </main>
  )
}

