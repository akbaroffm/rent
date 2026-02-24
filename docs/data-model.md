# IjaraSafe — Ma'lumotlar Modeli (Data Model)

## Entities

### User

```
User {
  id: String (UUID)
  phone: String (unique, +998XXXXXXXXX)
  name: String
  role: Enum ['tenant', 'owner', 'agent', 'admin']
  avatar: String? (URL)
  verified: Boolean (default: false)
  verifiedAt: DateTime?
  blocked: Boolean (default: false)
  agentAreas: String[]?        // faqat agent uchun
  agentRating: Float?           // faqat agent uchun
  agentDealsCount: Int?         // faqat agent uchun
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Listing

```
Listing {
  id: String (UUID)
  ownerId: String → User.id
  agentId: String? → User.id
  mode: Enum ['DIRECT', 'WITH_AGENT']
  title: String
  description: String
  price: Int (so'm, oylik)
  deposit: Int (so'm)
  currency: String (default: "so'm")
  rooms: Int
  floor: Int
  totalFloors: Int
  area: Int (m²)
  address: String
  district: String
  geo: { lat: Float, lng: Float }
  photos: String[] (URLs)
  features: {
    furnished: Boolean
    familyOnly: Boolean
    studentsOk: Boolean
    petsOk: Boolean
    parking: Boolean
    wifi: Boolean
    ac: Boolean
    washer: Boolean
  }
  rules: String?
  utilities: String?
  status: Enum ['active', 'occupied', 'archived']
  views: Int (default: 0)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Deal (Booking)

```
Deal {
  id: String (UUID)
  listingId: String → Listing.id
  tenantId: String → User.id
  ownerId: String → User.id
  agentId: String? → User.id
  rentAmount: Int
  agentFee: Int (max 20% of rentAmount)
  platformFee: Int (3% of rentAmount)
  total: Int (rentAmount + agentFee + platformFee)
  escrowStatus: EscrowStatus
  paymentMethod: String?
  createdAt: DateTime
  confirmDeadline: DateTime (createdAt + 2h)
  checkinDeadline: DateTime? (confirmedAt + 24h)
  confirmedAt: DateTime?
  releasedAt: DateTime?
  cancelledAt: DateTime?
  history: EscrowHistory[]
}
```

### EscrowStatus (Enum)

```
CREATED                    // Bron yaratildi
AWAITING_OWNER_CONFIRM     // Uy egasi tasdiqlashini kutilmoqda
CONFIRMED                  // Tasdiqlangan
FUNDS_HELD                 // Platformada ushlab turildi
CHECKIN_PENDING            // Ko'chib kirish kutilmoqda
DISPUTE_OPEN               // Muammo ochildi
REFUNDED                   // Qaytarildi
RELEASED                   // To'landi
CANCELLED                  // Bekor qilindi
```

### EscrowHistory

```
EscrowHistory {
  status: EscrowStatus
  at: DateTime
  note: String
}
```

### Dispute

```
Dispute {
  id: String (UUID)
  dealId: String → Deal.id
  reason: String
  evidence: String[] (URLs to photos/videos)
  adminDecision: Enum? ['refund_full', 'refund_partial', 'release']
  adminNote: String?
  decisionAt: DateTime?
  createdAt: DateTime
}
```

### Conversation

```
Conversation {
  id: String (UUID)
  participants: String[] → User.id[]
  listingId: String? → Listing.id
  lastMessage: String
  lastMessageAt: DateTime
  unread: Int
}
```

### Message

```
Message {
  id: String (UUID)
  conversationId: String → Conversation.id
  senderId: String → User.id
  receiverId: String → User.id
  text: String
  timestamp: DateTime
}
```

## Relationships

- User 1 → N Listing (ownerId)
- User 1 → N Listing (agentId)
- Listing 1 → N Deal
- Deal 1 → 0..1 Dispute
- User N ↔ N Conversation
- Conversation 1 → N Message
