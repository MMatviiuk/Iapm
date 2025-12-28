import { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Check, Trash2, Clock, Pill, Settings, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';

interface Notification {
  id: number;
  type: 'medication' | 'reminder' | 'achievement' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  medicationName?: string;
}

interface NotificationsManagerProps {
  onBack: () => void;
  darkMode: boolean;
}

export default function NotificationsManager({
  onBack,
  darkMode,
}: NotificationsManagerProps) {
  // Mock notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'medication',
      title: 'Time to take Aspirin',
      message: 'Take 1 tablet (100mg) with food',
      time: '2 hours ago',
      read: false,
      medicationName: 'Aspirin',
    },
    {
      id: 2,
      type: 'achievement',
      title: 'Achievement Unlocked!',
      message: 'You earned the "7 Day Streak" badge',
      time: '5 hours ago',
      read: false,
    },
    {
      id: 3,
      type: 'medication',
      title: 'Lisinopril reminder',
      message: 'Take 1 tablet (10mg) before meal',
      time: '1 day ago',
      read: true,
      medicationName: 'Lisinopril',
    },
    {
      id: 4,
      type: 'system',
      title: 'Weekly Summary Ready',
      message: 'Your medication adherence for this week is 95%',
      time: '2 days ago',
      read: true,
    },
    {
      id: 5,
      type: 'reminder',
      title: 'Refill Reminder',
      message: 'Metformin supply running low (3 days left)',
      time: '3 days ago',
      read: true,
    },
  ]);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'medication' | 'reminder' | 'achievement' | 'system'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Group notifications by type
  const groupedNotifications = {
    medication: notifications.filter(n => n.type === 'medication'),
    reminder: notifications.filter(n => n.type === 'reminder'),
    achievement: notifications.filter(n => n.type === 'achievement'),
    system: notifications.filter(n => n.type === 'system'),
  };

  // Filter notifications based on active filter
  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === activeFilter);

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if ('vibrate' in navigator) navigator.vibrate(30);
    toast.success('Marked as read');
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if ('vibrate' in navigator) navigator.vibrate(50);
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if ('vibrate' in navigator) navigator.vibrate([30, 30]);
    toast.success('Notification deleted');
  };

  const handleClearAll = () => {
    setNotifications([]);
    if ('vibrate' in navigator) navigator.vibrate([50, 50, 50]);
    toast.success('All notifications cleared');
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'medication':
        return <Pill className="w-6 h-6 text-[#2196F3]" />;
      case 'achievement':
        return <span className="text-2xl">🏆</span>;
      case 'reminder':
        return <Clock className="w-6 h-6 text-orange-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string, read: boolean) => {
    if (read) return 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
    switch (type) {
      case 'medication':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'achievement':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'reminder':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800';
      default:
        return 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <div
      className={`min-h-screen pb-24 lg:pb-8 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      {/* Header */}
      <div
        className={`sticky top-0 z-10 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        } px-4 sm:px-6 lg:px-8 py-4 sm:py-6`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={onBack}
                variant="ghost"
                className="h-12 sm:h-14 px-4 touch-manipulation"
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
              <div>
                <h1
                  className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  Notifications
                </h1>
                {unreadCount > 0 && (
                  <p className="text-gray-500 mt-1 text-lg">
                    {unreadCount} unread
                  </p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="outline"
                className="h-12 px-4 touch-manipulation"
              >
                <Check className="w-5 h-5 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2
              className={`text-xl font-bold mb-4 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <Settings className="w-6 h-6 mr-2 text-[#2196F3]" />
              Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`font-semibold text-lg ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Push Notifications
                  </p>
                  <p className="text-sm text-gray-500">
                    Receive medication reminders
                  </p>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                  className="data-[state=checked]:bg-[#2196F3]"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`font-semibold text-lg ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Sound
                  </p>
                  <p className="text-sm text-gray-500">Play notification sound</p>
                </div>
                <Switch
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                  className="data-[state=checked]:bg-[#2196F3]"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p
                    className={`font-semibold text-lg ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    Vibration
                  </p>
                  <p className="text-sm text-gray-500">
                    Vibrate on notification
                  </p>
                </div>
                <Switch
                  checked={vibrationEnabled}
                  onCheckedChange={setVibrationEnabled}
                  className="data-[state=checked]:bg-[#2196F3]"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('all')}
                className={`h-12 px-4 touch-manipulation ${
                  activeFilter === 'all' ? 'bg-[#2196F3]' : ''
                }`}
              >
                <Bell className="w-5 h-5 mr-2" />
                All ({notifications.length})
              </Button>
              <Button
                variant={activeFilter === 'medication' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('medication')}
                className={`h-12 px-4 touch-manipulation ${
                  activeFilter === 'medication' ? 'bg-blue-600' : ''
                }`}
              >
                <Pill className="w-5 h-5 mr-2" />
                Medications ({groupedNotifications.medication.length})
              </Button>
              <Button
                variant={activeFilter === 'reminder' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('reminder')}
                className={`h-12 px-4 touch-manipulation ${
                  activeFilter === 'reminder' ? 'bg-orange-600' : ''
                }`}
              >
                <Clock className="w-5 h-5 mr-2" />
                Reminders ({groupedNotifications.reminder.length})
              </Button>
              <Button
                variant={activeFilter === 'achievement' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('achievement')}
                className={`h-12 px-4 touch-manipulation ${
                  activeFilter === 'achievement' ? 'bg-yellow-600' : ''
                }`}
              >
                🏆 Achievements ({groupedNotifications.achievement.length})
              </Button>
              <Button
                variant={activeFilter === 'system' ? 'default' : 'outline'}
                onClick={() => setActiveFilter('system')}
                className={`h-12 px-4 touch-manipulation ${
                  activeFilter === 'system' ? 'bg-gray-600' : ''
                }`}
              >
                <Settings className="w-5 h-5 mr-2" />
                System ({groupedNotifications.system.length})
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Notifications List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              className={`text-xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              {activeFilter === 'all' ? 'All Notifications' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Notifications`}
            </h2>
            {filteredNotifications.length > 0 && (
              <Button
                onClick={handleClearAll}
                variant="ghost"
                className="text-red-600 hover:text-red-700 h-10"
              >
                Clear All
              </Button>
            )}
          </div>

          {filteredNotifications.length === 0 ? (
            <Card
              className={`p-12 text-center ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <Bell className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3
                className={`text-xl font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                No notifications
              </h3>
              <p className="text-gray-500">You're all caught up!</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`p-4 border ${getNotificationColor(
                      notification.type,
                      notification.read
                    )}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3
                            className={`font-bold text-lg ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <Badge className="bg-[#2196F3] text-white text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p
                          className={`text-base mb-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-sm text-gray-500">
                          {notification.time}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center touch-manipulation transition-colors"
                            aria-label="Mark as read"
                          >
                            <Check className="w-5 h-5 text-white" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center touch-manipulation transition-colors"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
