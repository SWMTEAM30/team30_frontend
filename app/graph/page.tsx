import '@xyflow/react/dist/style.css';
import ModelSession from '@/components/graph/ModelSesson';
import GraphHeader from '@/components/graph/GraphHeader';
import GraphFlow from '@/components/graph/GraphFlow';
import GraphContextProvider from '@/components/graph/GraphContextProvider';

export default function GraphPage() {
  return (
    <GraphContextProvider>
      <div className="h-screen bg-[#F1FAFB] flex relative">
        <div className="flex-1 flex flex-col">
          <GraphHeader />
          <div className="flex-1">
            <GraphFlow />
          </div>
        </div>
        <ModelSession />
      </div>
    </GraphContextProvider>
  );
}
