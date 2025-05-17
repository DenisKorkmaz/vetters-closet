import { DependencyGraph } from '@/components/graph/DependencyGraph';

export default function Home() {
  // Simulate an error in the LIMS system that affects connected systems
  const errorState = {
    systemId: 'LIMS',
    errorMessage: 'Database connection timeout - Unable to process test results'
  };

  return (
    <main className="container mx-auto p-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">System Landscape Overview</h1>
          <p className="text-muted-foreground">
            Visualizing dependencies between ERP, MES, LIMS, QMS, and DMS systems
          </p>
        </div>
        
        <DependencyGraph 
          errorState={errorState}
        />
      </div>
    </main>
  );
} 