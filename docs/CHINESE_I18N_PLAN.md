# Chinese i18n Implementation Plan

## Overview

Implement full internationalization (i18n) using react-i18next to translate the entire UI to Chinese, making the existing language toggle functional.

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ Language Toggle │────▶│  LanguageContext │────▶│  react-i18next  │
│ (DashboardLayout)│     │  (localStorage)  │     │                 │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                          │
                                    ┌─────────────────────┼─────────────────────┐
                                    ▼                     ▼                     ▼
                              ┌──────────┐          ┌──────────┐          ┌──────────┐
                              │  en.json │          │  zh.json │          │  (BOTH)  │
                              │ English  │          │ Chinese  │          │ Combined │
                              └──────────┘          └──────────┘          └──────────┘
```

## Phased Implementation (Safe Rollout)

### Phase 1: Foundation (No Breaking Changes)
- Install dependencies
- Create i18n config
- Create translation JSON files
- Create LanguageContext

### Phase 2: Connect Toggle (Minimal Changes)
- Wire up DashboardLayout language toggle
- Test switching works with a few strings

### Phase 3: Incremental Component Updates
- Update components one at a time
- Each component update is isolated and testable

---

## Files to Create

| File | Purpose |
|------|---------|
| `frontend/src/i18n/index.ts` | i18n configuration |
| `frontend/src/i18n/locales/en.json` | English translations |
| `frontend/src/i18n/locales/zh.json` | Chinese translations |
| `frontend/src/contexts/LanguageContext.tsx` | Language state + localStorage |

## Files to Modify

| File | Change |
|------|--------|
| `frontend/src/main.tsx` | Wrap app with i18n provider |
| `frontend/src/components/layouts/DashboardLayout.tsx` | Connect toggle to i18n |
| All page/component files | Add `useTranslation()` hook |

---

## Implementation Steps

### Step 1: Install Dependencies

```bash
cd frontend
npm install react-i18next i18next i18next-browser-languagedetector
```

### Step 2: Create i18n Configuration

**File: `frontend/src/i18n/index.ts`**

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import zh from './locales/zh.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
```

### Step 3: Create LanguageContext

**File: `frontend/src/contexts/LanguageContext.tsx`**

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type LanguageMode = 'EN' | 'CN' | 'BOTH';

interface LanguageContextType {
  language: LanguageMode;
  setLanguage: (lang: LanguageMode) => void;
  t: (key: string) => string;
  tBoth: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { t, i18n } = useTranslation();
  const [language, setLanguageState] = useState<LanguageMode>(() => {
    return (localStorage.getItem('appLanguage') as LanguageMode) || 'EN';
  });

  const setLanguage = (lang: LanguageMode) => {
    setLanguageState(lang);
    localStorage.setItem('appLanguage', lang);

    // Update i18next language
    if (lang === 'CN') {
      i18n.changeLanguage('zh');
    } else {
      i18n.changeLanguage('en');
    }
  };

  // Bilingual helper: "English / 中文"
  const tBoth = (key: string): string => {
    const enText = i18n.t(key, { lng: 'en' });
    const zhText = i18n.t(key, { lng: 'zh' });
    return `${enText} / ${zhText}`;
  };

  // Smart translation based on mode
  const translate = (key: string): string => {
    if (language === 'BOTH') {
      return tBoth(key);
    }
    return t(key);
  };

  useEffect(() => {
    // Sync i18n on mount
    if (language === 'CN') {
      i18n.changeLanguage('zh');
    } else {
      i18n.changeLanguage('en');
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translate, tBoth }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
```

### Step 4: Initialize in main.tsx

```typescript
import './i18n'; // Add this import at the top
import { LanguageProvider } from './contexts/LanguageContext';

// Wrap your app:
<LanguageProvider>
  <App />
</LanguageProvider>
```

### Step 5: Update DashboardLayout Toggle

Replace the placeholder `handleLanguageChange`:

```typescript
import { useLanguage } from '../../contexts/LanguageContext';

// Inside component:
const { language, setLanguage, t } = useLanguage();

const handleLanguageChange = (lang: 'EN' | 'CN' | 'BOTH') => {
  setLanguage(lang);
  toast.success(t('common.languageSwitched'));
};
```

---

## Complete Translation Keys

### en.json (English)

```json
{
  "app": {
    "name": "Mei Way Mail",
    "tagline": "Professional Mail & Package Management Services"
  },

  "nav": {
    "dashboard": "Dashboard",
    "mailLog": "Mail Log",
    "customers": "Customers",
    "templates": "Email Templates",
    "scan": "Scan",
    "todos": "To-Do",
    "followUps": "Follow-ups",
    "fees": "Fee Collection",
    "settings": "Settings",
    "intake": "Mail Intake"
  },

  "common": {
    "save": "Save",
    "saveChanges": "Save Changes",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add",
    "search": "Search",
    "searchPlaceholder": "Search...",
    "loading": "Loading...",
    "saving": "Saving...",
    "deleting": "Deleting...",
    "processing": "Processing...",
    "confirm": "Confirm",
    "close": "Close",
    "back": "Back",
    "next": "Next",
    "previous": "Previous",
    "viewAll": "View All",
    "refresh": "Refresh",
    "loadMore": "Load More",
    "noResults": "No results found",
    "required": "Required",
    "optional": "Optional",
    "yes": "Yes",
    "no": "No",
    "languageSwitched": "Language updated",
    "actions": "Actions",
    "status": "Status",
    "date": "Date",
    "type": "Type",
    "notes": "Notes",
    "description": "Description"
  },

  "auth": {
    "signIn": "Sign In",
    "signUp": "Sign Up",
    "signOut": "Sign Out",
    "logout": "Logout",
    "email": "Email",
    "password": "Password",
    "forgotPassword": "Forgot Password?",
    "noAccount": "Don't have an account?",
    "hasAccount": "Already have an account?",
    "staffSignIn": "Staff Sign In",
    "staffRegistration": "Staff Registration"
  },

  "customers": {
    "title": "Customers",
    "addNew": "Add New Customer",
    "addCustomer": "Add Customer",
    "editCustomer": "Edit Customer",
    "saveCustomer": "Save Customer",
    "customerProfile": "Customer Profile",
    "contactDetail": "Contact Detail",
    "searchPlaceholder": "Search by Name / Company / Mailbox #",
    "noCustomers": "No customers yet",
    "getStarted": "Get started by adding your first customer",
    "showArchived": "Show Archived",
    "viewingArchived": "Viewing Archived",
    "archive": "Archive",
    "restore": "Restore",
    "backToDirectory": "Back to Directory",
    "customerSince": "Customer Since",
    "showing": "Showing {count} of {total} customers"
  },

  "customerForm": {
    "name": "Name",
    "fullName": "Full name",
    "company": "Company",
    "companyName": "Company name",
    "email": "Email",
    "phone": "Phone",
    "phoneNumber": "Phone number",
    "mailboxNumber": "Mailbox #",
    "unitNumber": "Unit #",
    "serviceTier": "Service Tier",
    "languagePreference": "Preferred Language",
    "status": "Customer Status",
    "displayNamePreference": "Display Name Preference",
    "displayNameHelp": "How should this customer appear in lists?",
    "displayBoth": "Both (Company - Person)",
    "displayCompany": "Company Name Only",
    "displayPerson": "Person Name Only",
    "tier1": "Tier 1 - Basic",
    "tier2": "Tier 2 - Standard",
    "contactInfo": "Contact Information"
  },

  "customerStatus": {
    "pending": "Pending",
    "active": "Active",
    "archived": "Archived",
    "inactive": "Inactive"
  },

  "mail": {
    "title": "Mail Log",
    "logMail": "Log Mail",
    "logNewMail": "Log New Mail",
    "addNewMail": "Add New Mail",
    "scanMail": "Scan Mail",
    "mailIntake": "Mail Intake",
    "mailHistory": "Mail History",
    "noMailHistory": "No mail history yet",
    "noEntriesYet": "No entries yet today",
    "todaysEntries": "Today's Entries",
    "todaysMail": "Today's Mail",
    "pendingPickups": "Pending Pickups",
    "customer": "Customer",
    "selectCustomer": "Select a customer",
    "itemType": "Item Type",
    "quantity": "Quantity",
    "receivedDate": "Received Date",
    "viewInLog": "View in Log"
  },

  "mailTypes": {
    "letter": "Letter",
    "package": "Package",
    "largePackage": "Large Package",
    "certifiedMail": "Certified Mail"
  },

  "mailStatus": {
    "received": "Received",
    "notified": "Notified",
    "readyForPickup": "Ready for Pickup",
    "pickedUp": "Picked Up",
    "forward": "Forward",
    "scanned": "Scanned",
    "abandoned": "Abandoned"
  },

  "mailActions": {
    "markAsNotified": "Mark as Notified",
    "markAsPickedUp": "Mark as Picked Up",
    "markAllPickedUp": "Mark All Picked Up",
    "confirmPickup": "Confirm Pick Up",
    "confirmForward": "Confirm Forward",
    "confirmScan": "Confirm Scan",
    "confirmAbandoned": "Confirm Abandoned",
    "whoNotified": "Who notified?",
    "howNotified": "How did you notify?",
    "whoPerformed": "Who performed this action?"
  },

  "fees": {
    "title": "Fee Collection",
    "outstandingFees": "Outstanding Fees",
    "collectFees": "Collect Fees",
    "waiveFees": "Waive Fees",
    "collectFee": "Collect Fee",
    "waiveFee": "Waive Fee",
    "paymentMethod": "Payment Method",
    "whoCollected": "Who collected?",
    "waiveReason": "Waive Reason",
    "whoWaiving": "Who is waiving this fee?",
    "cash": "Cash",
    "card": "Card",
    "venmo": "Venmo",
    "zelle": "Zelle",
    "paypal": "PayPal",
    "check": "Check",
    "other": "Other"
  },

  "followUps": {
    "title": "Follow-ups",
    "noFollowUps": "No follow-ups",
    "needsAttention": "{count} customers need attention",
    "overdue": "Overdue"
  },

  "todos": {
    "title": "To-Do",
    "todoList": "To-Do List",
    "noTasks": "No tasks",
    "completed": "Completed",
    "tasksCompleted": "tasks completed"
  },

  "templates": {
    "title": "Email Templates",
    "sendEmail": "Send Email",
    "subjectLine": "Subject Line",
    "message": "Message",
    "sentBy": "Sent By",
    "translateToChinese": "Translate to Chinese"
  },

  "settings": {
    "title": "Settings",
    "manageAccount": "Manage your account settings and integrations",
    "gmailIntegration": "Gmail Integration",
    "connectGmail": "Connect Gmail Account",
    "disconnectGmail": "Disconnect Gmail",
    "gmailConnected": "Gmail Connected",
    "changePassword": "Change Password",
    "newPassword": "New Password",
    "confirmPassword": "Confirm New Password",
    "passwordMinLength": "Enter new password (min 6 characters)",
    "reenterPassword": "Re-enter new password"
  },

  "dashboard": {
    "title": "Dashboard",
    "todaysOverview": "Today's Overview",
    "mailAgeDistribution": "Mail Age Distribution",
    "currentPendingByAge": "Current pending items by age",
    "staffPerformance": "Staff Performance",
    "thisWeek": "This Week",
    "thisMonth": "This Month",
    "newCustomers": "New Customers",
    "vsLastMonth": "vs {count} last month"
  },

  "ageRanges": {
    "0to3days": "0-3 days",
    "4to7days": "4-7 days",
    "8to14days": "8-14 days",
    "15to30days": "15-30 days",
    "over30days": "30+ days"
  },

  "quickActions": {
    "title": "Quick Actions",
    "scanMail": "Scan Mail",
    "startNewScan": "Start a new scan session",
    "logMail": "Log Mail",
    "manuallyAdd": "Manually add mail items",
    "addCustomer": "Add Customer",
    "createProfile": "Create a new customer profile"
  },

  "modals": {
    "notifyCustomer": "Notify Customer",
    "additionalDetails": "Any additional details...",
    "addNotes": "Add any notes about this mail item..."
  },

  "toast": {
    "mailLogged": "Mail logged successfully!",
    "customerAdded": "Customer added successfully!",
    "customerUpdated": "Customer updated successfully!",
    "customerArchived": "Customer archived successfully!",
    "customerRestored": "Customer restored successfully!",
    "emailSent": "Email sent successfully",
    "emailSentTo": "Email sent to {customer}",
    "markedAsNotified": "Marked as notified!",
    "markedAsPickedUp": "Marked as picked up",
    "markedAsForwarded": "Marked as forwarded",
    "markedAsScanned": "Marked as scanned",
    "markedAsAbandoned": "Marked as abandoned",
    "passwordChanged": "Password changed successfully!",
    "gmailDisconnected": "Gmail disconnected successfully",
    "itemsMarkedAs": "{count} entries for {customer} marked as {status}",
    "failedToLoad": "Failed to load {item}",
    "failedToSave": "Failed to save {item}",
    "failedToDelete": "Failed to delete {item}",
    "languageComingSoon": "Language switching feature coming soon!"
  },

  "validation": {
    "selectCustomer": "Please select a customer",
    "enterNameOrCompany": "Please enter either a name or company name",
    "mailboxRequired": "Mailbox number is required",
    "phoneMustBe10Digits": "Phone number must be exactly 10 digits",
    "passwordMinLength": "Password must be at least 6 characters long",
    "passwordsDoNotMatch": "Passwords do not match",
    "provideReason": "Please provide a reason (at least 5 characters)",
    "selectPerformer": "Please select who performed this action"
  },

  "warnings": {
    "tier1NoPackages": "Tier 1 customers typically don't receive packages",
    "tier1PackageWarning": "Warning: This customer is on Service Tier 1, which typically does not include package handling. Are you sure you want to log a package for this customer?",
    "confirmArchive": "Are you sure you want to archive this customer?",
    "confirmRestore": "Are you sure you want to restore this customer?",
    "confirmDisconnectGmail": "Are you sure you want to disconnect your Gmail account?",
    "canRestoreLater": "You can restore it later from the archived view",
    "needToReconnect": "You will need to reconnect to send emails"
  },

  "language": {
    "english": "English",
    "chinese": "Chinese",
    "both": "Both Languages",
    "en": "EN",
    "cn": "CN"
  }
}
```

### zh.json (Chinese)

```json
{
  "app": {
    "name": "美威邮件",
    "tagline": "专业邮件和包裹管理服务"
  },

  "nav": {
    "dashboard": "仪表板",
    "mailLog": "邮件日志",
    "customers": "客户",
    "templates": "邮件模板",
    "scan": "扫描",
    "todos": "待办",
    "followUps": "跟进",
    "fees": "费用收取",
    "settings": "设置",
    "intake": "邮件收件"
  },

  "common": {
    "save": "保存",
    "saveChanges": "保存更改",
    "cancel": "取消",
    "delete": "删除",
    "edit": "编辑",
    "add": "添加",
    "search": "搜索",
    "searchPlaceholder": "搜索...",
    "loading": "加载中...",
    "saving": "保存中...",
    "deleting": "删除中...",
    "processing": "处理中...",
    "confirm": "确认",
    "close": "关闭",
    "back": "返回",
    "next": "下一步",
    "previous": "上一步",
    "viewAll": "查看全部",
    "refresh": "刷新",
    "loadMore": "加载更多",
    "noResults": "未找到结果",
    "required": "必填",
    "optional": "可选",
    "yes": "是",
    "no": "否",
    "languageSwitched": "语言已更新",
    "actions": "操作",
    "status": "状态",
    "date": "日期",
    "type": "类型",
    "notes": "备注",
    "description": "描述"
  },

  "auth": {
    "signIn": "登录",
    "signUp": "注册",
    "signOut": "退出",
    "logout": "退出登录",
    "email": "邮箱",
    "password": "密码",
    "forgotPassword": "忘记密码？",
    "noAccount": "还没有账户？",
    "hasAccount": "已有账户？",
    "staffSignIn": "员工登录",
    "staffRegistration": "员工注册"
  },

  "customers": {
    "title": "客户",
    "addNew": "添加新客户",
    "addCustomer": "添加客户",
    "editCustomer": "编辑客户",
    "saveCustomer": "保存客户",
    "customerProfile": "客户资料",
    "contactDetail": "联系详情",
    "searchPlaceholder": "按姓名/公司/信箱号搜索",
    "noCustomers": "暂无客户",
    "getStarted": "添加第一位客户开始使用",
    "showArchived": "显示已归档",
    "viewingArchived": "查看已归档",
    "archive": "归档",
    "restore": "恢复",
    "backToDirectory": "返回目录",
    "customerSince": "客户自",
    "showing": "显示 {count} / {total} 位客户"
  },

  "customerForm": {
    "name": "姓名",
    "fullName": "全名",
    "company": "公司",
    "companyName": "公司名称",
    "email": "邮箱",
    "phone": "电话",
    "phoneNumber": "电话号码",
    "mailboxNumber": "信箱号",
    "unitNumber": "单元号",
    "serviceTier": "服务等级",
    "languagePreference": "语言偏好",
    "status": "客户状态",
    "displayNamePreference": "显示名称偏好",
    "displayNameHelp": "在列表中如何显示此客户？",
    "displayBoth": "两者（公司 - 个人）",
    "displayCompany": "仅公司名称",
    "displayPerson": "仅个人姓名",
    "tier1": "等级1 - 基础",
    "tier2": "等级2 - 标准",
    "contactInfo": "联系信息"
  },

  "customerStatus": {
    "pending": "待处理",
    "active": "活跃",
    "archived": "已归档",
    "inactive": "非活跃"
  },

  "mail": {
    "title": "邮件日志",
    "logMail": "记录邮件",
    "logNewMail": "记录新邮件",
    "addNewMail": "添加新邮件",
    "scanMail": "扫描邮件",
    "mailIntake": "邮件收件",
    "mailHistory": "邮件历史",
    "noMailHistory": "暂无邮件历史",
    "noEntriesYet": "今日暂无记录",
    "todaysEntries": "今日记录",
    "todaysMail": "今日邮件",
    "pendingPickups": "待取件",
    "customer": "客户",
    "selectCustomer": "选择客户",
    "itemType": "物品类型",
    "quantity": "数量",
    "receivedDate": "收件日期",
    "viewInLog": "在日志中查看"
  },

  "mailTypes": {
    "letter": "信件",
    "package": "包裹",
    "largePackage": "大包裹",
    "certifiedMail": "挂号信"
  },

  "mailStatus": {
    "received": "已收到",
    "notified": "已通知",
    "readyForPickup": "待取件",
    "pickedUp": "已取走",
    "forward": "转寄",
    "scanned": "已扫描",
    "abandoned": "已放弃"
  },

  "mailActions": {
    "markAsNotified": "标记为已通知",
    "markAsPickedUp": "标记为已取走",
    "markAllPickedUp": "全部标记为已取走",
    "confirmPickup": "确认取件",
    "confirmForward": "确认转寄",
    "confirmScan": "确认扫描",
    "confirmAbandoned": "确认放弃",
    "whoNotified": "谁通知的？",
    "howNotified": "如何通知的？",
    "whoPerformed": "谁执行的此操作？"
  },

  "fees": {
    "title": "费用收取",
    "outstandingFees": "未付费用",
    "collectFees": "收取费用",
    "waiveFees": "免除费用",
    "collectFee": "收取费用",
    "waiveFee": "免除费用",
    "paymentMethod": "付款方式",
    "whoCollected": "谁收取的？",
    "waiveReason": "免除原因",
    "whoWaiving": "谁免除的此费用？",
    "cash": "现金",
    "card": "刷卡",
    "venmo": "Venmo",
    "zelle": "Zelle",
    "paypal": "PayPal",
    "check": "支票",
    "other": "其他"
  },

  "followUps": {
    "title": "跟进",
    "noFollowUps": "暂无跟进",
    "needsAttention": "{count} 位客户需要关注",
    "overdue": "逾期"
  },

  "todos": {
    "title": "待办",
    "todoList": "待办事项",
    "noTasks": "暂无任务",
    "completed": "已完成",
    "tasksCompleted": "任务已完成"
  },

  "templates": {
    "title": "邮件模板",
    "sendEmail": "发送邮件",
    "subjectLine": "主题",
    "message": "内容",
    "sentBy": "发送人",
    "translateToChinese": "翻译成中文"
  },

  "settings": {
    "title": "设置",
    "manageAccount": "管理您的账户设置和集成",
    "gmailIntegration": "Gmail 集成",
    "connectGmail": "连接 Gmail 账户",
    "disconnectGmail": "断开 Gmail",
    "gmailConnected": "Gmail 已连接",
    "changePassword": "修改密码",
    "newPassword": "新密码",
    "confirmPassword": "确认新密码",
    "passwordMinLength": "输入新密码（至少6个字符）",
    "reenterPassword": "重新输入新密码"
  },

  "dashboard": {
    "title": "仪表板",
    "todaysOverview": "今日概览",
    "mailAgeDistribution": "邮件积压分布",
    "currentPendingByAge": "按时长分类的待处理邮件",
    "staffPerformance": "员工绩效",
    "thisWeek": "本周",
    "thisMonth": "本月",
    "newCustomers": "新客户",
    "vsLastMonth": "对比上月 {count}"
  },

  "ageRanges": {
    "0to3days": "0-3 天",
    "4to7days": "4-7 天",
    "8to14days": "8-14 天",
    "15to30days": "15-30 天",
    "over30days": "30+ 天"
  },

  "quickActions": {
    "title": "快捷操作",
    "scanMail": "扫描邮件",
    "startNewScan": "开始新的扫描",
    "logMail": "记录邮件",
    "manuallyAdd": "手动添加邮件",
    "addCustomer": "添加客户",
    "createProfile": "创建新客户资料"
  },

  "modals": {
    "notifyCustomer": "通知客户",
    "additionalDetails": "其他详情...",
    "addNotes": "添加关于此邮件的备注..."
  },

  "toast": {
    "mailLogged": "邮件记录成功！",
    "customerAdded": "客户添加成功！",
    "customerUpdated": "客户更新成功！",
    "customerArchived": "客户归档成功！",
    "customerRestored": "客户恢复成功！",
    "emailSent": "邮件发送成功",
    "emailSentTo": "邮件已发送至 {customer}",
    "markedAsNotified": "已标记为已通知！",
    "markedAsPickedUp": "已标记为已取走",
    "markedAsForwarded": "已标记为已转寄",
    "markedAsScanned": "已标记为已扫描",
    "markedAsAbandoned": "已标记为已放弃",
    "passwordChanged": "密码修改成功！",
    "gmailDisconnected": "Gmail 已断开连接",
    "itemsMarkedAs": "{customer} 的 {count} 条记录已标记为 {status}",
    "failedToLoad": "加载 {item} 失败",
    "failedToSave": "保存 {item} 失败",
    "failedToDelete": "删除 {item} 失败",
    "languageComingSoon": "语言切换功能即将推出！"
  },

  "validation": {
    "selectCustomer": "请选择客户",
    "enterNameOrCompany": "请输入姓名或公司名称",
    "mailboxRequired": "信箱号为必填项",
    "phoneMustBe10Digits": "电话号码必须为10位数字",
    "passwordMinLength": "密码至少需要6个字符",
    "passwordsDoNotMatch": "两次输入的密码不一致",
    "provideReason": "请提供原因（至少5个字符）",
    "selectPerformer": "请选择执行此操作的人员"
  },

  "warnings": {
    "tier1NoPackages": "等级1客户通常不接收包裹",
    "tier1PackageWarning": "警告：此客户为服务等级1，通常不包含包裹处理。确定要为此客户记录包裹吗？",
    "confirmArchive": "确定要归档此客户吗？",
    "confirmRestore": "确定要恢复此客户吗？",
    "confirmDisconnectGmail": "确定要断开 Gmail 账户吗？",
    "canRestoreLater": "您可以稍后从归档视图中恢复",
    "needToReconnect": "您需要重新连接才能发送邮件"
  },

  "language": {
    "english": "English",
    "chinese": "中文",
    "both": "双语",
    "en": "EN",
    "cn": "中"
  }
}
```

---

## Bilingual Mode ("BOTH") Handling

For "BOTH" mode, use the `tBoth` helper which returns `"English / 中文"` format.

**For navigation items** (short strings): Inline works well
```
Dashboard / 仪表板
```

**For longer content** (form labels, messages): Consider stacked layout
```jsx
<label>
  {language === 'BOTH' ? (
    <>
      <span>{t('customerForm.name', { lng: 'en' })}</span>
      <span className="text-gray-500 ml-1">/ {t('customerForm.name', { lng: 'zh' })}</span>
    </>
  ) : (
    t('customerForm.name')
  )}
</label>
```

---

## Testing Checklist

- [ ] Language toggle switches between EN/CN/BOTH
- [ ] Language preference persists after page refresh
- [ ] All navigation items translate correctly
- [ ] All form labels translate correctly
- [ ] All buttons translate correctly
- [ ] All toast messages translate correctly
- [ ] Bilingual mode displays both languages
- [ ] No missing translation keys (check console for warnings)
- [ ] Build passes without errors

---

## Rollback Plan

If issues arise:
1. The i18n setup is additive - original hardcoded strings still work
2. Simply remove `useTranslation()` calls to revert components
3. Language toggle can fall back to showing "coming soon" toast

---

## Date

Last updated: January 2026
