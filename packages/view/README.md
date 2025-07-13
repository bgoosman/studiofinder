# Studio Finder Frontend

A React TypeScript application for finding and managing studio slots. Built with modern web technologies including Mantine UI, Tailwind CSS, and functional programming utilities.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **Yarn** (v1.22 or higher)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd studiofinder/packages/view
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up slots data** (if needed)
   ```bash
   yarn slots
   ```
   This copies the universe.json file from the finder package to the slots directory.

4. **Start development server**
   ```bash
   yarn dev
   # or
   yarn start
   ```

The application will open automatically in your default browser at `http://localhost:8080`.

## 🛠️ Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` / `yarn start` | Start development server with hot reload |
| `yarn build` | Build for production |
| `yarn slots` | Copy universe.json from finder package |

### Project Structure

```
src/
├── components/          # React components
├── state/              # State management (simpler-state)
├── types/              # TypeScript type definitions
├── fp/                 # Functional programming utilities
├── datetime/           # Date/time utilities
├── html/               # HTML templates and partials
├── static/             # Static assets
├── __mocks__/          # Jest mocks
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── App.css             # Global styles
```

### Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Mantine** - UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **Webpack 5** - Module bundler
- **Jest** - Testing framework
- **Luxon** - Date/time manipulation
- **fp-ts** - Functional programming utilities
- **simpler-state** - State management

### Development Workflow

1. **Make changes** to components in `src/components/`
2. **Update state** in `src/state/` if needed
3. **Add types** in `src/types/` for new data structures
4. **Test changes** using Jest
5. **Build and deploy** when ready

### Code Style

The project uses:
- **Prettier** for code formatting
- **TypeScript strict mode** for type safety
- **ESLint** for code linting (if configured)
- **EditorConfig** for consistent editor settings

## 🧪 Testing

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test --coverage
```

### Test Configuration

Tests are configured in `jest.config.js`:
- Uses `jsdom` environment for DOM testing
- Supports TypeScript with `ts-jest`
- Mocks CSS and asset files
- Includes `jest-sorted` for consistent test ordering

### Writing Tests

- Test files should be named `*.test.tsx` or `*.test.ts`
- Use React Testing Library for component testing
- Mock external dependencies as needed

## 🏗️ Building

### Development Build

```bash
yarn dev
```

### Production Build

```bash
yarn build
```

The production build:
- Optimizes and minifies code
- Generates static assets in `dist/` directory
- Includes source maps for debugging
- Copies assets from `assets/` directory

### Build Configuration

- **Webpack** handles bundling and optimization
- **PostCSS** processes CSS with Tailwind and Autoprefixer
- **TypeScript** compilation with strict type checking
- **Asset optimization** for images and other static files

## 📦 Dependencies

### Core Dependencies

- **React ecosystem**: React, React DOM, React Router
- **UI libraries**: Mantine, Headless UI, Heroicons, Tabler Icons
- **Styling**: Tailwind CSS, Emotion
- **State management**: simpler-state
- **Date/time**: Luxon, date-fns, dayjs
- **Functional programming**: fp-ts, fp-ts-std, monocle-ts
- **Utilities**: Lodash, Immer, classnames

### Development Dependencies

- **Build tools**: Webpack, TypeScript, PostCSS
- **Testing**: Jest, React Testing Library
- **Code quality**: Prettier, EditorConfig
- **Development server**: webpack-dev-server

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `webpack.config.js` | Webpack base configuration |
| `webpack.dev.js` | Development webpack config |
| `webpack.prod.js` | Production webpack config |
| `tailwind.config.js` | Tailwind CSS configuration |
| `postcss.config.js` | PostCSS configuration |
| `jest.config.js` | Jest testing configuration |
| `.prettierrc` | Prettier formatting rules |
| `.editorconfig` | Editor settings |

## 🌐 Deployment

### Static Hosting

The application builds to static files that can be deployed to any static hosting service:

1. **Build the application**
   ```bash
   yarn build
   ```

2. **Deploy the `dist/` directory** to your hosting service

### Environment Variables

Create a `.env` file in the root directory for environment-specific configuration:

```env
# Example environment variables
NODE_ENV=development
API_URL=http://localhost:3000
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Add tests** for new functionality
5. **Ensure all tests pass**
6. **Submit a pull request**

### Development Guidelines

- Follow TypeScript best practices
- Use functional programming patterns where appropriate
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Port already in use**
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

**TypeScript errors**
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
yarn install
```

**Build failures**
```bash
# Clear all caches
rm -rf node_modules dist .cache
yarn install
yarn build
```

### Getting Help

- Check the [issues](https://github.com/bgoosman/studiofinder/issues) page
- Review the codebase structure and examples
- Ensure all dependencies are properly installed
