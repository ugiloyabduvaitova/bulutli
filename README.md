# Interactive Star Rating Component ⭐

A modern, interactive rating component built with React, TypeScript, and Tailwind CSS. Features smooth animations, multiple icon types, and customizable styling.

## ✨ Features

- **Multiple Icon Types**: Star, Heart, Fire, Thumb, Diamond, Rocket
- **Half-Star Ratings**: Support for 0.5 increments
- **Customizable**: Size, color, max rating value
- **Smooth Animations**: Ripple and float particle effects
- **Accessibility**: Disabled and read-only modes
- **TypeScript**: Full type safety
- **iOS Style UI**: Beautiful glass-morphism design

## 📦 Installation

```bash
npm install
```

## 🚀 Development

```bash
npm run dev
```

Starts the development server at `http://localhost:5173`

## 🏗️ Building

```bash
npm run build
```

Creates optimized production build in `dist/` folder

## 📋 Usage

```tsx
import { Rating } from './components/Rating';

function App() {
  const [value, setValue] = useState(3);

  return (
    <Rating
      value={value}
      onChange={setValue}
      max={5}
      icon="star"
      size="lg"
      color="yellow"
      showValue={true}
      animated={true}
    />
  );
}
```

## 🎨 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number | - | Current rating value |
| `onChange` | (value: number) => void | - | Callback on rating change |
| `max` | number | 5 | Maximum rating value |
| `allowHalf` | boolean | true | Allow 0.5 increments |
| `icon` | IconType | 'star' | Icon type to display |
| `size` | 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | Icon size |
| `color` | string | 'yellow' | Icon color |
| `disabled` | boolean | false | Disable interactions |
| `readOnly` | boolean | false | Read-only mode |
| `showValue` | boolean | true | Show rating value |
| `animated` | boolean | true | Enable animations |
| `label` | string | - | Rating label text |

## 🛠️ Tech Stack

- **React** 19.2.3 - UI library
- **TypeScript** 5.9 - Type safety
- **Vite** 7.2 - Build tool
- **Tailwind CSS** 4.1 - Styling
- **Clsx** - Conditional classnames
- **Tailwind Merge** - Merge Tailwind classes

## 📝 Project Structure

```
src/
├── components/
│   └── Rating.tsx       # Main rating component
├── utils/
│   └── cn.ts            # Classname utility
├── App.tsx              # Application root
├── main.tsx             # Entry point
└── index.css            # Global styles
```

## 📄 License

MIT

## 🤝 Contributing

Feel free to submit issues and enhancement requests!
