import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockConversations, mockMessages } from '@/data/mock'

export const useChatStore = defineStore('chat', () => {
  const conversations = ref([...mockConversations])
  const messages = ref([...mockMessages])

  function getConversationsForUser(userId) {
    return conversations.value
      .filter(c => c.participants.includes(userId))
      .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
  }

  function getMessages(conversationId) {
    return messages.value
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }

  function sendMessage(conversationId, senderId, receiverId, text) {
    const msg = {
      id: 'm' + (messages.value.length + 1),
      conversationId,
      senderId,
      receiverId,
      text,
      timestamp: new Date().toISOString()
    }
    messages.value.push(msg)

    const conv = conversations.value.find(c => c.id === conversationId)
    if (conv) {
      conv.lastMessage = text
      conv.lastMessageAt = msg.timestamp
    }

    return msg
  }

  function startConversation(userId1, userId2, listingId) {
    const existing = conversations.value.find(c =>
      c.participants.includes(userId1) && c.participants.includes(userId2) && c.listingId === listingId
    )
    if (existing) return existing

    const conv = {
      id: 'conv' + (conversations.value.length + 1),
      participants: [userId1, userId2],
      listingId,
      lastMessage: '',
      lastMessageAt: new Date().toISOString(),
      unread: 0
    }
    conversations.value.push(conv)
    return conv
  }

  const totalUnread = computed(() => {
    return conversations.value.reduce((sum, c) => sum + (c.unread || 0), 0)
  })

  return {
    conversations, messages,
    getConversationsForUser, getMessages,
    sendMessage, startConversation, totalUnread
  }
})
