# Frontend Project Structure

## 📁 Cấu trúc thư mục

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components (Button, Input, etc.)
│   └── ...             # Feature-specific components
├── constants/           # Application constants
│   └── index.ts        # API config, storage keys, validation rules, etc.
├── contexts/           # React Context providers
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom React hooks
│   └── auth/          # Authentication hooks
├── navigation/          # Navigation configuration
│   ├── types.ts       # Navigation type definitions
│   ├── AuthNavigator.tsx
│   ├── MainNavigator.tsx
│   └── BottomTabNavigator.tsx
├── screens/            # Screen components
│   └── auth/           # Authentication screens
├── services/           # API services
│   ├── api/           # API client, error handling, types
│   └── auth/          # Authentication service
├── theme/              # Theme configuration
│   ├── colors.ts      # Color palette
│   ├── typography.ts  # Typography system
│   ├── spacing.ts     # Spacing system
│   └── index.ts       # Theme export
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Utility functions
    ├── validation.ts  # Validation helpers
    ├── formatters.ts  # Formatting helpers
    ├── helpers.ts     # General helpers
    └── index.ts       # Utils export
```

## 🎨 Theme System

Theme được tổ chức trong thư mục `theme/`:

- **Colors**: Bảng màu chính, màu trạng thái, màu text, background, border
- **Typography**: Font sizes, weights, line heights, letter spacing
- **Spacing**: Hệ thống spacing và layout constants

Sử dụng:
```typescript
import { colors, typography, spacing } from '../theme';
```

## 🔧 Constants

Tất cả constants được tập trung trong `constants/index.ts`:

- API configuration
- Storage keys
- API endpoints
- Validation rules
- Error messages
- Success messages

## 🛠️ Utils

### Validation
Các hàm validation cho form inputs:
- `validateEmail()`
- `validatePassword()`
- `validatePhone()`
- `validateOTP()`
- `validateRequired()`

### Formatters
Các hàm format dữ liệu:
- `formatCurrency()` - Format tiền VNĐ
- `formatPhone()` - Format số điện thoại
- `formatDate()` - Format ngày tháng
- `truncateText()` - Cắt text

### Helpers
Các utility functions:
- `storage` - AsyncStorage helpers
- `tokenStorage` - Token management
- `debounce()` - Debounce function
- `getErrorMessage()` - Extract error message

## 🔐 Authentication

### AuthContext
Quản lý authentication state toàn ứng dụng:
```typescript
const { user, isAuthenticated, login, logout } = useAuthContext();
```

### useAuth Hook
Custom hook cho authentication operations:
```typescript
const { handleLogin, handleRegister, isLoading } = useAuth();
```

## 🧩 Components

### Common Components

#### Button
```typescript
<Button
  title="Đăng nhập"
  onPress={handleSubmit}
  variant="primary"
  size="medium"
  loading={isLoading}
  fullWidth
/>
```

#### Input
```typescript
<Input
  label="Email"
  placeholder="example@gmail.com"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
  leftIcon="mail-outline"
/>
```

## 📡 Services

### API Client
Axios instance với interceptors cho authentication và error handling:
```typescript
import apiClient from '../services/api/apiClient';
```

### Auth Service
Authentication API calls:
```typescript
import { login, register, forgotPassword } from '../services/auth/auth.service';
```

## 🧭 Navigation

Navigation được tổ chức theo feature:
- `AuthNavigator` - Authentication flow
- `MainNavigator` - Main app flow (sau khi đăng nhập)
- `BottomTabNavigator` - Bottom tabs

Types được định nghĩa trong `navigation/types.ts`.

## 📝 Best Practices

1. **Sử dụng theme**: Luôn dùng colors, typography, spacing từ theme
2. **Validation**: Sử dụng validation utils thay vì validate inline
3. **Error handling**: Sử dụng `handleApiError()` để xử lý lỗi
4. **Components**: Tái sử dụng common components
5. **Types**: Định nghĩa types rõ ràng cho tất cả props và data
6. **Constants**: Không hardcode values, dùng constants

## 🚀 Getting Started

1. Import theme khi cần styling
2. Sử dụng common components cho UI
3. Sử dụng hooks và contexts cho state management
4. Sử dụng services cho API calls
5. Sử dụng utils cho validation và formatting
