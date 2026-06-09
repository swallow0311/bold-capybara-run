import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { 
  ShieldAlert, CheckCircle2, AlertTriangle, 
  RefreshCw, Check, Sparkles, AlertCircle,
  FileText, Image as ImageIcon, Video as VideoIcon,
  Filter, Download, Trash2, Eye, 
  FileSpreadsheet, ShieldCheck, ChevronRight,
  Play, Info, ChevronDown, Layers, Settings2,
  Search, Calendar
} from 'lucide-react';
import { showSuccess } from '@/utils/toast';
import { cn } from "@/lib/utils";

// 扩展后的模拟质检数据
const MOCK_DATA = {
  text: [
    { id: 'T1', name: '中达面霜大促文案_版本A', type: '文本', status: '重度违规', riskCount: 2, time: '2026-05-20 10:30', content: '中达这款防晒绝对是全网“最强”的防晒喷雾！能够“第一”速度成膜，彻底根除紫外线。', risks: [{ word: '最强', type: '极限词', rule: '广告法第九条' }, { word: '第一', type: '极限词', rule: '广告法第九条' }] },
    { id: 'T2', name: '精华液种草笔记_小红书', type: '文本', status: '轻度风险', riskCount: 1, time: '2026-05-20 11:15', content: '这款精华液具有“美白治病”的神奇功效，三天见效。', risks: [{ word: '治病', type: '虚假宣传', rule: '化妆品监督管理条例' }] },
    { id: 'T3', name: '唇蜜营销话术_直播间', type: '文本', status: '合规通过', riskCount: 0, time: '2026-05-20 12:00', content: '夏日清爽水光感，温和修护唇部肌肤，打造果冻嘟嘟唇。', risks: [] },
    { id: 'T4', name: '防晒喷雾详情页文案', type: '文本', status: '重度违规', riskCount: 1, time: '2026-05-20 14:20', content: '全网“最低价”，错过再等一年，绝对“根除”晒黑烦恼。', risks: [{ word: '最低价', type: '价格违规', rule: '价格法' }] },
    { id: 'T5', name: '新品面霜预热推文', type: '文本', status: '待人工复核', riskCount: 1, time: '2026-05-20 15:45', content: '这款面霜含有“诺贝尔奖”成分，让你的肌肤重回18岁。', risks: [{ word: '诺贝尔奖', type: '虚假背书', rule: '广告法' }] }
  ],
  image: [
    { id: 'I1', name: '面霜主图海报_618版', type: '图片', status: '重度违规', riskCount: 1, url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400', risks: [{ area: '左上角', type: '侵权LOGO', rule: '知识产权法' }] },
    { id: 'I2', name: '防晒详情页_场景图', type: '图片', status: '轻度风险', riskCount: 1, url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', risks: [{ area: '文案区', type: '极限词', rule: '广告法' }] },
    { id: 'I3', name: '唇蜜模特试色图', type: '图片', status: '合规通过', riskCount: 0, url: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400', risks: [] },
    { id: 'I4', name: '精华液成分拆解图', type: '图片', status: '重度违规', riskCount: 2, url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', risks: [{ area: '底部', type: '导流二维码', rule: '平台规范' }, { area: '中部', type: '未授权LOGO', rule: '商标法' }] }
  ],
  video: [
    { id: 'V1', name: '唇蜜卡点短视频_抖音', type: '视频', status: '重度违规', riskCount: 1, timeNode: '00:05', risks: [{ node: '00:05', type: '违规字幕', rule: '广告法' }] },
    { id: 'V2', name: '面霜使用教程视频', type: '视频', status: '轻度风险', riskCount: 1, timeNode: '00:12', risks: [{ node: '00:12', type: '背景侵权音乐', rule: '版权法' }] },
    { id: 'V3', name: '防晒喷雾测评视频', type: '视频', status: '合规通过', riskCount: 0, timeNode: '-', risks: [] }
  ]
};

const ComplianceQA = () => {
  const [activeModule, setActiveModule] = useState('text');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailItem, setDetailItem] = useState<any>(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);

  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedIds(prev => checked ? [...prev, id] : prev.filter(i => i !== id));
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      '合规通过': 'bg-emerald-100 text-emerald-700',
      '轻度风险': 'bg-amber-100 text-amber-700',
      '重度违规': 'bg-rose-100 text-rose-700',
      '待人工复核': 'bg-blue-100 text-blue-700',
      '检测中': 'bg-slate-100 text-slate-600 animate-pulse'
    };
    return <Badge className={cn("border-none text-[10px] font-bold", styles[status])}>{status}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full space-y-4 relative text-left">
        
        {/* 顶部筛选操作区 */}
        <Card className="border-none shadow-sm shrink-0">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Tabs value={activeModule} onValueChange={setActiveModule} className="w-auto">
                <TabsList className="bg-slate-100/50 p-1">
                  <TabsTrigger value="text" className="text-xs gap-2"><FileText className="w-3.5 h-3.5" />文本质检</TabsTrigger>
                  <TabsTrigger value="image" className="text-xs gap-2"><ImageIcon className="w-3.5 h-3.5" />图片质检</TabsTrigger>
                  <TabsTrigger value="video" className="text-xs gap-2"><VideoIcon className="w-3.5 h-3.5" />视频质检</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[140px] h-9 text-xs bg-slate-50">
                    <SelectValue placeholder="风险等级" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部风险等级</SelectItem>
                    <SelectItem value="high">重度违规</SelectItem>
                    <SelectItem value="low">轻度风险</SelectItem>
                    <SelectItem value="pass">合规通过</SelectItem>
                  </SelectContent>
                </Select>

                {/* 高级筛选 Popover */}
                <Popover open={isAdvancedFilterOpen} onOpenChange={setIsAdvancedFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 text-xs">
                      <Filter className="w-3.5 h-3.5 mr-1.5" />高级筛选
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4 space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-bold text-sm">高级筛选条件</h4>
                      <p className="text-[10px] text-slate-400">组合多个维度精准定位质检结果</p>
                    </div>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-[11px]">关键词搜索</Label>
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                          <Input className="h-8 pl-7 text-xs" placeholder="搜索任务名称或SKU..." />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px]">质检时间范围</Label>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="h-8 text-[10px] flex-1 justify-start">
                            <Calendar className="w-3 h-3 mr-1.5" /> 开始日期
                          </Button>
                          <span className="text-slate-300">-</span>
                          <Button variant="outline" size="sm" className="h-8 text-[10px] flex-1 justify-start">
                            <Calendar className="w-3 h-3 mr-1.5" /> 结束日期
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[11px]">关联商品品类</Label>
                        <Select defaultValue="all">
                          <SelectTrigger className="h-8 text-[10px] bg-slate-50">
                            <SelectValue placeholder="全部品类" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">全部品类</SelectItem>
                            <SelectItem value="cream">面霜</SelectItem>
                            <SelectItem value="sun">防晒</SelectItem>
                            <SelectItem value="lip">彩妆</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="ghost" size="sm" className="flex-1 text-xs" onClick={() => setIsAdvancedFilterOpen(false)}>重置</Button>
                      <Button size="sm" className="flex-1 text-xs bg-rose-400 hover:bg-rose-500 text-white" onClick={() => {
                        setIsAdvancedFilterOpen(false);
                        showSuccess("已应用高级筛选条件");
                      }}>应用筛选</Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setIsRulesOpen(true)}
                variant="outline" 
                size="sm" 
                className="h-9 text-xs border-rose-200 text-rose-600 hover:bg-rose-50"
              >
                <Settings2 className="w-3.5 h-3.5 mr-1.5" />质检规则
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 中部列表 + 右侧详情 */}
        <div className="flex-1 flex gap-4 overflow-hidden">
          
          {/* 中部检测结果列表 */}
          <Card className="flex-1 border-none shadow-sm overflow-hidden flex flex-col">
            <CardHeader className="py-3 border-b border-slate-100 shrink-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-400" />
                检测结果明细 ({MOCK_DATA[activeModule as keyof typeof MOCK_DATA].length})
              </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
              <div className="p-0">
                <Table>
                  <TableHeader className="bg-slate-50/50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="w-[40px] text-center">
                        <Checkbox checked={selectedIds.length > 0} onCheckedChange={(c) => setSelectedIds(c ? MOCK_DATA[activeModule as keyof typeof MOCK_DATA].map(i => i.id) : [])} />
                      </TableHead>
                      <TableHead className="text-xs">检测对象名称</TableHead>
                      <TableHead className="text-xs">风险点</TableHead>
                      <TableHead className="text-xs">检测时间</TableHead>
                      <TableHead className="text-xs text-center">状态</TableHead>
                      <TableHead className="text-xs text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_DATA[activeModule as keyof typeof MOCK_DATA].map((item: any) => (
                      <TableRow 
                        key={item.id} 
                        className={cn(
                          "cursor-pointer transition-colors text-xs",
                          detailItem?.id === item.id ? "bg-rose-50/30" : "hover:bg-slate-50/50"
                        )}
                        onClick={() => setDetailItem(item)}
                      >
                        <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
                          <Checkbox checked={selectedIds.includes(item.id)} onCheckedChange={(c) => handleSelectItem(item.id, !!c)} />
                        </TableCell>
                        <TableCell className="font-bold text-slate-700">{item.name}</TableCell>
                        <TableCell>
                          {item.riskCount > 0 ? (
                            <span className="text-rose-500 font-bold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> {item.riskCount} 个风险点
                            </span>
                          ) : (
                            <span className="text-emerald-500 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> 无风险
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-400 font-mono">{item.time}</TableCell>
                        <TableCell className="text-center">{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-7 text-[10px] text-rose-500 hover:bg-rose-50">
                            查看详情 <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </Card>

          {/* 右侧详情预览 */}
          <Card className="w-[400px] border-none shadow-sm shrink-0 flex flex-col overflow-hidden">
            <CardHeader className="py-3 border-b border-slate-100 shrink-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Eye className="w-4 h-4 text-rose-400" />
                风险定位与详情预览
              </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1">
              {detailItem ? (
                <div className="p-5 space-y-6 text-left">
                  {/* 预览区 */}
                  <div className="space-y-2">
                    <Label className="text-[11px] font-bold text-slate-400 uppercase">内容预览</Label>
                    {activeModule === 'text' && (
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs leading-relaxed font-mono">
                        {detailItem.content.split('“').map((part: string, i: number) => {
                          if (i === 0) return part;
                          const [word, rest] = part.split('”');
                          return (
                            <React.Fragment key={i}>
                              <span className="bg-rose-100 text-rose-600 px-1 rounded font-bold border border-rose-200 line-through decoration-double">
                                {word}
                              </span>
                              {rest}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    )}
                    {activeModule === 'image' && (
                      <div className="relative aspect-square bg-slate-900 rounded-xl overflow-hidden border border-slate-100">
                        <img src={detailItem.url} className="w-full h-full object-cover opacity-80" alt="preview" />
                        {detailItem.risks.map((risk: any, idx: number) => (
                          <div key={idx} className="absolute top-4 left-4 w-20 h-20 border-2 border-rose-500 bg-rose-500/20 animate-pulse flex items-center justify-center">
                            <Badge className="bg-rose-500 text-white text-[8px] absolute -top-2 -left-2">风险点</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                    {activeModule === 'video' && (
                      <div className="aspect-video bg-slate-900 rounded-xl relative flex items-center justify-center">
                        <Play className="w-10 h-10 text-white/50" />
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
                          <div className="absolute left-[30%] w-2 h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                        </div>
                        {detailItem.timeNode !== '-' && (
                          <Badge className="absolute bottom-4 left-4 bg-rose-500 text-white text-[9px]">{detailItem.timeNode} 违规节点</Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 风险列表 */}
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold text-slate-400 uppercase">风险点诊断报告</Label>
                    {detailItem.risks.length > 0 ? (
                      detailItem.risks.map((risk: any, idx: number) => (
                        <div key={idx} className="p-3 bg-rose-50/30 border border-rose-100 rounded-xl space-y-2">
                          <div className="flex justify-between items-center">
                            <Badge className="bg-rose-500 text-white text-[9px] border-none">{risk.type}</Badge>
                            <span className="text-[10px] text-slate-400 font-mono">依据：{risk.rule}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            检测到违规内容：<span className="font-bold text-rose-600">“{risk.word || risk.area || risk.node}”</span>。违反平台合规准则，建议立即修正。
                          </p>
                          <div className="flex gap-2 pt-1">
                            <Button size="sm" className="h-7 text-[10px] bg-rose-400 hover:bg-rose-500 text-white flex-1">
                              <Sparkles className="w-3 h-3 mr-1" /> 一键AI修复
                            </Button>
                            <Button variant="outline" size="sm" className="h-7 text-[10px] flex-1">忽略风险</Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center bg-emerald-50/30 border border-emerald-100 rounded-xl space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                        <p className="text-xs text-emerald-700 font-bold">该内容已通过合规质检</p>
                        <p className="text-[10px] text-emerald-600/70">符合国家AIGC合成内容标识规范</p>
                      </div>
                    )}
                  </div>

                  {/* 溯源日志 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                      AIGC 合规溯源日志
                    </div>
                    <div className="space-y-1 text-[10px] text-slate-400 font-mono">
                      <p>生成引擎：中达美妆垂直大模型 v2.0</p>
                      <p>溯源ID：{detailItem.id}-AIGC-20260520</p>
                      <p>合规标识：已注入隐式水印</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 opacity-40">
                  <ShieldCheck className="w-16 h-16 text-slate-300" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-500">暂未选择检测项</p>
                    <p className="text-xs text-slate-400">请从左侧列表中选择一项查看详细质检报告</p>
                  </div>
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>

        {/* 底部批量操作栏 */}
        <div className={cn(
          "fixed bottom-6 left-72 right-8 bg-white/95 backdrop-blur-md border border-slate-200 shadow-2xl p-4 rounded-2xl z-40 transition-all flex items-center justify-between",
          selectedIds.length === 0 ? "translate-y-32 opacity-0" : "translate-y-0 opacity-100"
        )}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 rounded-xl border border-rose-100">
              <span className="text-xs font-bold text-rose-600">已选中 {selectedIds.length} 项</span>
              <button onClick={() => setSelectedIds([])} className="text-rose-400 hover:text-rose-600"><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="h-6 w-[1px] bg-slate-200" />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200"><Sparkles className="w-3.5 h-3.5 mr-1.5 text-rose-400" /> 批量AI修复</Button>
              <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200"><Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> 批量忽略风险</Button>
              <Button variant="outline" size="sm" className="h-9 text-xs border-slate-200"><RefreshCw className="w-3.5 h-3.5 mr-1.5 text-blue-500" /> 批量重新检测</Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-xs text-slate-500 hover:text-rose-500"><FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> 导出合规报告</Button>
            <Button className="bg-rose-400 hover:bg-rose-500 text-white h-9 px-6 text-xs font-bold rounded-xl shadow-lg shadow-rose-200">
              一键同步发布 (仅限合规项)
            </Button>
          </div>
        </div>
      </div>

      {/* 质检规则配置 Dialog */}
      <Dialog open={isRulesOpen} onOpenChange={setIsRulesOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600">
              <Settings2 className="w-5 h-5" />
              合规质检规则配置中心
            </DialogTitle>
            <DialogDescription>
              配置各模块的AI质检维度与拦截阈值，确保生成内容符合国家法律法规及电商平台规范。
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-8 py-4">
              {/* 文案质检规则 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <FileText className="w-4 h-4 text-rose-400" />
                  <h3 className="text-sm font-bold text-slate-800">文案质检规则配置</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: '广告法极限词拦截', desc: '拦截“第一”、“顶级”、“全网最低”等绝对化用词', checked: true },
                    { label: '虚假宣传检测', desc: '识别绝对效果承诺、医疗功效、美白治病等话术', checked: true },
                    { label: '价格违规审查', desc: '检测虚标原价、虚假折扣、违规比价等价格敏感词', checked: true },
                    { label: '敏感内容过滤', desc: '过滤政治、色情、暴力等社会敏感类文本内容', checked: true },
                    { label: '侵权话术识别', desc: '自动规避未授权品牌背书、他人肖像权描述', checked: false },
                    { label: '平台规则适配', desc: '根据淘宝/京东/拼多多不同平台规则动态调整', checked: true }
                  ].map((rule, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-700">{rule.label}</p>
                        <p className="text-[10px] text-slate-400">{rule.desc}</p>
                      </div>
                      <Switch defaultChecked={rule.checked} />
                    </div>
                  ))}
                </div>
              </div>

              {/* 图片质检规则 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <ImageIcon className="w-4 h-4 text-rose-400" />
                  <h3 className="text-sm font-bold text-slate-800">图片质检规则配置</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <p className="text-xs font-bold text-slate-700">画面拦截维度</p>
                      <div className="flex flex-wrap gap-2">
                        {['低俗', '裸露', '暴力', '政治敏感', '违规医疗'].map(tag => (
                          <Badge key={tag} variant="outline" className="text-[9px] bg-white">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex justify-end"><Switch defaultChecked /></div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <p className="text-xs font-bold text-slate-700">素材拦截维度</p>
                      <div className="flex flex-wrap gap-2">
                        {['网络侵权图', '明星肖像', '未授权LOGO', '盗图相似度'].map(tag => (
                          <Badge key={tag} variant="outline" className="text-[9px] bg-white">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex justify-end"><Switch defaultChecked /></div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <p className="text-xs font-bold text-slate-700">文案拦截维度</p>
                      <div className="flex flex-wrap gap-2">
                        {['内嵌极限词', '违规促销语', '虚假功效文字'].map(tag => (
                          <Badge key={tag} variant="outline" className="text-[9px] bg-white">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex justify-end"><Switch defaultChecked /></div>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                      <p className="text-xs font-bold text-slate-700">瑕疵拦截维度</p>
                      <div className="flex flex-wrap gap-2">
                        {['残留水印', '第三方LOGO', '违规二维码', '导流信息'].map(tag => (
                          <Badge key={tag} variant="outline" className="text-[9px] bg-white">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex justify-end"><Switch defaultChecked /></div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-700">贴纸拦截维度</p>
                      <p className="text-[10px] text-slate-400">拦截违规绝对化营销标、不合规权益话术贴纸</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              {/* 视频质检规则 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <VideoIcon className="w-4 h-4 text-rose-400" />
                  <h3 className="text-sm font-bold text-slate-800">视频质检规则配置</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: '视频帧画面检测', desc: '同图片合规标准，拦截敏感、侵权、违规画面', checked: true },
                    { label: '字幕文本检测', desc: '全文检测极限词、虚假宣传，与文本规则对齐', checked: true },
                    { label: '音频人声检测', desc: '检测口播违规话术、敏感词汇、侵权配音内容', checked: true },
                    { label: '动态元素拦截', desc: '拦截违规动态贴纸、营销动效、第三方素材', checked: true }
                  ].map((rule, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-slate-700">{rule.label}</p>
                        <p className="text-[10px] text-slate-400">{rule.desc}</p>
                      </div>
                      <Switch defaultChecked={rule.checked} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="pt-4 border-t border-slate-100">
            <Button variant="ghost" size="sm" onClick={() => setIsRulesOpen(false)}>取消</Button>
            <Button size="sm" className="bg-rose-400 hover:bg-rose-500 text-white" onClick={() => {
              setIsRulesOpen(false);
              showSuccess("质检规则配置已更新，将应用于后续所有检测任务");
            }}>保存配置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

const X = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);

const Select = ({ children, defaultValue, onValueChange }: any) => (
  <div className="relative">
    <select 
      defaultValue={defaultValue} 
      onChange={(e) => onValueChange?.(e.target.value)}
      className="w-full h-9 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-rose-300"
    >
      {children}
    </select>
    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
  </div>
);

const SelectTrigger = ({ children, className }: any) => <div className={className}>{children}</div>;
const SelectValue = ({ placeholder }: any) => <span>{placeholder}</span>;
const SelectContent = ({ children }: any) => <>{children}</>;
const SelectItem = ({ value, children }: any) => <option value={value}>{children}</option>;

export default ComplianceQA;