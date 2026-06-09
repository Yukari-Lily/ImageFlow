import {
  Image as ImageIcon,
  PlusCircle as PlusCircledIcon,
  Plus as PlusIcon,
  X as Cross1Icon,
  Trash2 as TrashIcon,
  Clipboard as ClipboardCopyIcon,
  Check as CheckIcon,
  Eye as EyeOpenIcon,
  Search as MagnifyingGlassIcon,
  KeyRound as LockClosedIcon,
  Clock as ClockIcon,
  Tags as TagIcon,
  Info as InfoCircledIcon,
  ChevronDown as CaretDownIcon,
  AlertTriangle as ExclamationTriangleIcon,
  Upload as UploadIcon,
  File as FileIcon,
  SlidersHorizontal as MixerHorizontalIcon,
  Copy as CopyIcon,
  Moon as MoonIcon,
  Sun as SunIcon,
  Menu as HamburgerMenuIcon,
  ChevronDown,
  Link as Link1Icon,
  Camera as CameraIcon,
  Sparkles as SparklesIcon,
  Zap as ZapIcon,
  Code as CodeIcon,
} from 'lucide-react';

export {
  ImageIcon,
  PlusCircledIcon,
  PlusIcon,
  Cross1Icon,
  TrashIcon,
  ClipboardCopyIcon,
  CheckIcon,
  EyeOpenIcon,
  MagnifyingGlassIcon,
  LockClosedIcon,
  ClockIcon,
  TagIcon,
  InfoCircledIcon,
  CaretDownIcon,
  ExclamationTriangleIcon,
  UploadIcon,
  FileIcon,
  MixerHorizontalIcon,
  CopyIcon,
  MoonIcon,
  SunIcon,
  HamburgerMenuIcon,
  ChevronDown as ChevronDownIcon,
  Link1Icon,
  CameraIcon,
  SparklesIcon,
  ZapIcon,
  CodeIcon,
};

// 状态图标 - 为不同类型的状态消息提供图标
export const StatusIcon = {
  success: ({ className = "" }: { className?: string }) => (
    <CheckIcon className={`text-green-500 ${className}`} />
  ),
  error: ({ className = "" }: { className?: string }) => (
    <Cross1Icon className={`text-red-500 ${className}`} />
  ),
  warning: ({ className = "" }: { className?: string }) => (
    <ExclamationTriangleIcon className={`text-amber-500 ${className}`} />
  ),
  info: ({ className = "" }: { className?: string }) => (
    <InfoCircledIcon className={`text-blue-500 ${className}`} />
  )
};

// 封装通用 Spinner 组件
export const Spinner = ({ className = "" }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
