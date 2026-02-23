import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([
    {
      id: 'n1',
      userId: 'u1', // Tenant
      title: "To'lov eslatmasi",
      message: "Ertaga ijarangiz uchun to'lov muddati tugaydi. Iltimos to'lovni amalga oshiring.",
      type: 'warning', // warning, success, info, auth
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'n2',
      userId: 'u1',
      title: "Yangi uylar",
      message: "Siz qidirayotgan tumanda 3 ta yangi ijara e'lonlari paydo bo'ldi.",
      type: 'info',
      read: true,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ])

  function getNotificationsForUser(userId) {
    return notifications.value.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  function getUnreadCount(userId) {
    return notifications.value.filter(n => n.userId === userId && !n.read).length
  }

  function addNotification(notification) {
    notifications.value.unshift({
      ...notification,
      id: 'n' + Date.now(),
      read: false,
      createdAt: new Date().toISOString()
    })
  }

  function markAsRead(id) {
    const notif = notifications.value.find(n => n.id === id)
    if (notif) notif.read = true
  }

  function markAllAsRead(userId) {
    notifications.value.filter(n => n.userId === userId && !n.read).forEach(n => n.read = true)
  }

  function clearNotification(id) {
    const idx = notifications.value.findIndex(n => n.id === id)
    if (idx >= 0) notifications.value.splice(idx, 1)
  }

  return {
    notifications,
    getNotificationsForUser,
    getUnreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification
  }
})
