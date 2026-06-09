import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SelectionEngine from "./pages/SelectionEngine";
import ContentFactory from "./pages/ContentFactory";
import ImageDesign from "./pages/ImageDesign";
import VideoCreation from "./pages/VideoCreation";
import BatchTasks from "./pages/BatchTasks";
import AssetLibrary from "./pages/AssetLibrary";
import ComplianceQA from "./pages/ComplianceQA";
import SentimentAnalysis from "./pages/SentimentAnalysis";
import DataCenter from "./pages/DataCenter";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/selection" element={<SelectionEngine />} />
          <Route path="/content" element={<ContentFactory />} />
          <Route path="/image-design" element={<ImageDesign />} />
          <Route path="/video-creation" element={<VideoCreation />} />
          <Route path="/batch-tasks" element={<BatchTasks />} />
          <Route path="/asset-library" element={<AssetLibrary />} />
          <Route path="/compliance-qa" element={<ComplianceQA />} />
          <Route path="/sentiment" element={<SentimentAnalysis />} />
          <Route path="/data" element={<DataCenter />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;