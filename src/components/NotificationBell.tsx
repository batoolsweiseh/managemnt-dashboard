"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, Info, AlertTriangle, MessageCircle } from "lucide-react";
import { getUserNotifications, readNotification, clearAllNotifications } from "@/lib/actions";
import { Notification } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function NotificationBell() {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: notifications = [], refetch, isLoading, isError } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: () => getUserNotifications(),
    refetchInterval: 30000,
    staleTime: 25000,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRead = async (id: string) => {
    await readNotification(id);
    queryClient.invalidateQueries({ queryKey: ['notifications'] });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'ASSIGNMENT': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'STATUS_UPDATE': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Info className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2.5 rounded-xl transition-all duration-300 border flex items-center justify-center",
          isOpen 
            ? "bg-zinc-950 border-zinc-900 text-white shadow-xl" 
            : "bg-white border-zinc-100 hover:border-zinc-300 hover:shadow-md text-zinc-500"
        )}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-[2rem] border border-zinc-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300 origin-top-right z-[70]">
          <div className="p-5 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/50">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Broadcasts</span>
              <h3 className="font-black text-zinc-900">Notifications</h3>
            </div>
            {unreadCount > 0 && (
              <div className="px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
                <span className="text-[10px] font-black text-primary uppercase tracking-tighter">{unreadCount} New</span>
              </div>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
            {isLoading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 animate-pulse">
                    <div className="w-10 h-10 bg-zinc-100 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-zinc-100 rounded w-1/2" />
                      <div className="h-2 bg-zinc-100 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="p-12 text-center text-rose-500">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-bold uppercase tracking-widest">Signal Interrupted</p>
                <p className="text-[10px] mt-1 opacity-70">Failed to sync with command server.</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-zinc-100 italic font-medium text-zinc-300">
                  <Bell className="w-6 h-6" />
                </div>
                <p className="text-zinc-400 font-bold text-sm">No new signals detected.</p>
                <p className="text-[10px] text-zinc-300 font-bold uppercase mt-1 tracking-widest">All protocols nominal</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleRead(n.id)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl transition-all duration-300 flex gap-4 group",
                      n.read ? "opacity-60" : "bg-zinc-50 hover:bg-zinc-100"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                      n.read ? "bg-white border-zinc-100" : "bg-white border-zinc-200 shadow-sm"
                    )}>
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 space-y-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-[13px] text-zinc-900 truncate tracking-tight">{n.title}</span>
                        {!n.read && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-xs font-bold text-zinc-500 leading-relaxed line-clamp-2">
                        {n.message}
                      </p>
                      <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block pt-1">
                        {Math.abs(Date.now() - new Date(n.createdAt).getTime()) < 60000 
                          ? 'Just Now' 
                          : formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-zinc-50/50 flex items-center justify-between border-t border-zinc-50">
            <button 
              className="text-[10px] font-black text-zinc-400 hover:text-primary transition-colors uppercase tracking-[0.2em]"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              {isLoading ? 'Syncing...' : 'Force Refresh'}
            </button>
            {unreadCount > 0 && (
              <button 
                className="text-[10px] font-black text-primary hover:text-primary/80 transition-colors uppercase tracking-[0.2em]"
                onClick={async () => {
                  const result = await clearAllNotifications() as any;
                  if (result.success) {
                    queryClient.invalidateQueries({ queryKey: ['notifications'] });
                    toast.success("Broadcast history cleared.");
                  } else if (result.error) {
                    toast.error(result.error);
                  }
                }}
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
