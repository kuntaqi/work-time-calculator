import WorkTimeCalculator from "@/components/WorkTimeCalculator";

export default function Home() {
  return (
      <main className="min-h-screen bg-gray-100 flex flex-col">
          <header className="bg-blue-600 text-white p-4 text-center">
              <h1 className="text-2xl font-bold">Work Time Calculator</h1>
          </header>
          <div className="flex-grow container mx-auto px-4 py-8">
              <WorkTimeCalculator/>
          </div>
          <footer className="mt-8 py-4 text-center text-sm text-muted-foreground">
              Made with 🧠 by <a href="https://www.linkedin.com/in/taqiyudin/" target="_blank">Ahmad Taqiyudin</a> ®️
              2024
          </footer>
      </main>
  )
}

