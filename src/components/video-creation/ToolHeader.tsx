import React from 'react';
import { Button } from "@/components/ui/button";
import { RotateCcw, Undo2, Redo2, History, X } from 'lucide-react';
import { showSuccess } from '@/utils/toast';

interface ToolHeaderProps {
  title: string;
  onClose: () => void;
  onReset?: () => void;
}

const ToolHeader = ({ title, onClose, onReset }: ToolHeaderProps) => {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
      <div className="flex items-center gap-2">
        <h3 className="text-xs font-bold text-slate-800">{title}</h3>
      </div>
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500"
          onClick={() => showSuccess("已撤销上一步微调操作")}
          title="撤销"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500"
          onClick={() => showSuccess("已重做微调操作")}
          title="重做"
        >
          <Redo2 className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500"
          onClick={() => {
            if (onReset) onReset();
            showSuccess("已重置各项调参参数为默认状态");
          }}
          title="重置"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500"
          onClick={() => showSuccess("正在拉取视频历史渲染节点版本...")}
          title="版本回溯"
        >
          <History className="w-4 h-4" />
        </Button>
        <div className="w-[1px] h-4 bg-slate-200 mx-1" />
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ToolHeader;