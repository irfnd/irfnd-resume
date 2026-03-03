import { cn } from '@/utils/cn';
import { IconAlertTriangle, IconCircleCheck, IconInfoCircle, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
	id: string;
	message: string;
	variant: ToastVariant;
	duration?: number;
}

interface ToastContextType {
	toasts: Toast[];
	addToast: (message: string, variant?: ToastVariant, duration?: number) => void;
	removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | null>(null);

export function useToast() {
	const context = React.useContext(ToastContext);
	if (!context) {
		throw new Error('useToast must be used within a ToastProvider');
	}
	return context;
}

interface ToastProviderProps {
	children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
	const [toasts, setToasts] = React.useState<Toast[]>([]);

	const addToast = React.useCallback((message: string, variant: ToastVariant = 'info', duration = 5000) => {
		const id = crypto.randomUUID();
		setToasts((prev) => [...prev, { id, message, variant, duration }]);

		if (duration > 0) {
			setTimeout(() => {
				setToasts((prev) => prev.filter((t) => t.id !== id));
			}, duration);
		}
	}, []);

	const removeToast = React.useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const value = React.useMemo(() => ({ toasts, addToast, removeToast }), [toasts, addToast, removeToast]);

	return (
		<ToastContext.Provider value={value}>
			{children}
			<ToastContainer />
		</ToastContext.Provider>
	);
}

function ToastContainer() {
	const { toasts, removeToast } = useToast();

	return (
		<div className='fixed top-4 right-4 z-80 flex flex-col gap-2 max-w-sm w-full pointer-events-none'>
			<AnimatePresence mode='popLayout'>
				{toasts.map((toast) => (
					<ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
				))}
			</AnimatePresence>
		</div>
	);
}

interface ToastItemProps {
	toast: Toast;
	onClose: () => void;
}

const variantStyles: Record<ToastVariant, { bg: string; icon: typeof IconCircleCheck; iconColor: string }> = {
	success: {
		bg: 'bg-green-500/10 border-green-500/30',
		icon: IconCircleCheck,
		iconColor: 'text-green-500',
	},
	error: {
		bg: 'bg-red-500/10 border-red-500/30',
		icon: IconAlertTriangle,
		iconColor: 'text-red-500',
	},
	warning: {
		bg: 'bg-yellow-500/10 border-yellow-500/30',
		icon: IconAlertTriangle,
		iconColor: 'text-yellow-500',
	},
	info: {
		bg: 'bg-blue-500/10 border-blue-500/30',
		icon: IconInfoCircle,
		iconColor: 'text-blue-500',
	},
};

function ToastItem({ toast, onClose }: ToastItemProps) {
	const style = variantStyles[toast.variant];
	const Icon = style.icon;

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 20, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, x: 100, scale: 0.95 }}
			transition={{ type: 'spring', stiffness: 400, damping: 25 }}
			className={cn('pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-lg', style.bg)}
		>
			<Icon className={cn('size-5 shrink-0 mt-0.5', style.iconColor)} />
			<p className='flex-1 text-sm text-foreground font-medium'>{toast.message}</p>
			<button
				onClick={onClose}
				className='shrink-0 p-1 rounded-lg hover:bg-foreground/10 transition-colors cursor-pointer'
				aria-label='Close'
			>
				<IconX className='size-4 text-muted-foreground' />
			</button>
		</motion.div>
	);
}
