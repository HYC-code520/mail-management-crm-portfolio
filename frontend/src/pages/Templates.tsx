import { useState } from 'react';
import { Copy, Plus, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Template {
  id: string;
  category: string;
  textEN: string;
  textCN: string;
}

const mockTemplates: Template[] = [
  {
    id: '1',
    category: 'New Mail Notification',
    textEN: 'Hello {Name},\n\nYou have new mail waiting for you at Mei Way Mail Plus.\n\nMailbox: {BoxNumber}\nType: {Type}\nDate Received: {Date}\n\nPlease collect at your earliest convenience during business hours.\n\nBest regards,\nMei Way Mail Plus Team',
    textCN: '{Name} 您好，\n\n您在美威邮件中心有新邮件等待领取。\n\n邮箱号：{BoxNumber}\n类型：{Type}\n收件日期：{Date}\n\n请在营业时间内尽快领取。\n\n此致\n美威邮件团队',
  },
  {
    id: '2',
    category: 'Reminder (Uncollected Mail)',
    textEN: 'Dear {Name},\n\nThis is a friendly reminder that you have uncollected mail at Mei Way Mail Plus.\n\nMailbox: {BoxNumber}\nWaiting since: {Date}\n\nPlease collect your mail during business hours: Mon-Fri 9AM-5PM.\n\nThank you,\nMei Way Mail Plus',
    textCN: '亲爱的 {Name}，\n\n这是一封友好提醒，您在美威邮件中心有未领取的邮件。\n\n邮箱号：{BoxNumber}\n等待领取时间：{Date}\n\n请在营业时间内领取您的邮件：周一至周五 上午9点至下午5点。\n\n谢谢\n美威邮件中心',
  },
  {
    id: '3',
    category: 'Final Notice (After 1 Week)',
    textEN: 'FINAL NOTICE\n\nDear {Name},\n\nYour mail has been waiting at Mei Way Mail Plus for over one week.\n\nMailbox: {BoxNumber}\nReceived: {Date}\n\nPlease collect immediately. Uncollected items may be returned to sender or disposed of according to our policy.\n\nContact us if you need assistance.\n\nMei Way Mail Plus\nPhone: (555) 123-4567',
    textCN: '最后通知\n\n{Name} 您好，\n\n您的邮件已在美威邮件中心等待超过一周。\n\n邮箱号：{BoxNumber}\n收件日期：{Date}\n\n请立即领取。根据我们的政策，未领取的物品可能会被退回或处理。\n\n如需帮助，请联系我们。\n\n美威邮件中心\n电话：(555) 123-4567',
  },
];

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(mockTemplates[0]);

  const handleCopy = (text: string, lang: string) => {
    navigator.clipboard.writeText(text);
    if (lang === 'en') {
      toast.success('English template copied!');
    } else if (lang === 'cn') {
      toast.success('Chinese template copied!');
    } else {
      toast.success('Combined template copied!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Templates</h1>
        <p className="text-gray-600">Manage and use bilingual message templates</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Left Sidebar - Template List */}
        <div className="col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Templates</h3>
            </div>
            <div className="p-2">
              <div className="space-y-1">
                {mockTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`w-full text-left p-3 rounded-lg transition-colors text-sm ${
                      selectedTemplate.id === template.id
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {template.category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Template Display */}
        <div className="col-span-3 space-y-6">
          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">{selectedTemplate.category}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => toast.info('Edit functionality coming soon!')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => toast.info('New template functionality coming soon!')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Template</span>
              </button>
            </div>
          </div>

          {/* Three Column Template Display */}
          <div className="grid grid-cols-3 gap-6">
            {/* English Version */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">English Version</h3>
                <button
                  onClick={() => handleCopy(selectedTemplate.textEN, 'en')}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="p-4">
                <div className="h-[500px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap break-words text-sm text-gray-700 font-sans">
                    {selectedTemplate.textEN}
                  </pre>
                </div>
              </div>
            </div>

            {/* Chinese Version */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Chinese Version</h3>
                <button
                  onClick={() => handleCopy(selectedTemplate.textCN, 'cn')}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="p-4">
                <div className="h-[500px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap break-words text-sm text-gray-700 font-sans">
                    {selectedTemplate.textCN}
                  </pre>
                </div>
              </div>
            </div>

            {/* Combined Version */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Combined Version</h3>
                <button
                  onClick={() => handleCopy(`${selectedTemplate.textEN}\n\n---\n\n${selectedTemplate.textCN}`, 'combined')}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="p-4">
                <div className="h-[500px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap break-words text-sm text-gray-700 font-sans">
                    {selectedTemplate.textEN}
                    {'\n\n---\n\n'}
                    {selectedTemplate.textCN}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholders Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="space-y-3">
              <p className="font-semibold text-gray-900">Available placeholders:</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200">{'{Name}'}</span>
                  <span>- Customer name</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200">{'{BoxNumber}'}</span>
                  <span>- Mailbox number</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200">{'{Type}'}</span>
                  <span>- Mail type (letter/package)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-200">{'{Date}'}</span>
                  <span>- Date</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
