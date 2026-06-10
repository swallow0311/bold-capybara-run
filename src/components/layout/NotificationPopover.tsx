import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, AlertTriangle, Clock, ArrowRight, MessageSquare } from 'lucide-react';
import { cn } from "@/lib/utils";

const MOCK_NOTIFICATIONS = [
  { 
    id: 'AL-20260610-001', 
    title: 'XX酵母面霜库存告急', 
    time: '09:15', 
    level: '高级',
    type: '库存'
  },
  { 
    id: 'AL-20260610-002', 
    title: 'AIGC 文案包含极限词', 
    time: '08:40', 
    level: '高级',
    type: '合规'
  }
];

const NotificationPopover = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleViewDetails = () => {
    setOpen(false);
    navigate('/settings/alerts/records');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="p-2 text-slate-400 hover:text-slate-600 relative hover:bg-slate-50 rounded-full transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-400 rounded-full border border-white"></span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 border-slate-200 shadow-xl rounded-2xl overflow-hidden" align="end">
        <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-bold text-slate-800">待处理预警 ({MOCK_NOTIFICATIONS.length})</span>
          </div>
          <button 
            onClick={() => { setOpen(false); navigate('/settings/alerts/records'); }}
            className="text-[10px] text-slate-400 hover:text-rose-500 font-medium"
          >
            全部标记已读
          </button>
        </div>

        <ScrollArea className="max-h-[320px]">
          <div className="divide-y divide-slate-50">
            {MOCK_NOTIFICATIONS.map((item) => (
              <div key={item.id} className="p-4 hover:bg-slate-50/50 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 bg-rose-50 p-1.5 rounded-lg">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-700">{item.title}</span>
                      <Badge className="bg-rose-100 text-rose-700 border-none text-[8px] px-1 py-0">{item.level}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.time}</span>
                        <span>•</span>
                        <span>{item.type}预警</span>
                      </div>
                      <button 
                        onClick={handleViewDetails}
                        className="text-[10px] text-rose-500 font-bold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        查看详情 <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-3 bg-white border-t border-slate-100">
          <Button 
            variant="ghost" 
            className="w-full h-8 text-xs text-slate-500 hover:text-rose-500 hover:bg-rose-50 font-bold"
            onClick={() => { setOpen(false); navigate('/settings/alerts/records'); }}
          >
            进入预警记录中心
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationPopover;