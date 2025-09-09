# N1C Gene Registry - React Application

A modern, beautiful React application for the N1C Gene Registry, providing a searchable database of therapeutic approaches for rare genetic variants.

## Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Search Functionality**: Search across all registries (N-of-1 Projects, Marketed Drugs, Assessed Variants)
- **Data Visualization**: Grouped and sortable data tables with expandable sections
- **API Integration**: RESTful API for data access and search
- **Mobile Responsive**: Optimized for all device sizes
- **Accessibility**: Built with accessibility best practices

## Technology Stack

- **Frontend**: React 18 with React Router for navigation
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React for consistent iconography
- **Backend**: Flask API (existing) with CORS support

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Python 3.7+ (for the backend API)

### Installation

1. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Backend API**
   ```bash
   python app.py
   ```
   The API will run on `http://localhost:5000`

4. **Start the React Development Server**
   ```bash
   npm start
   ```
   The React app will run on `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.js       # Navigation header
│   ├── DataTable.js    # Data table with grouping
│   └── SearchResults.js # Search results display
├── pages/              # Page components
│   ├── Home.js         # Main landing page
│   ├── N1CProjects.js  # N-of-1 projects page
│   ├── MarketedDrugs.js # Marketed drugs page
│   ├── AssessedVariants.js # Assessed variants page
│   ├── EntryDetail.js  # Individual project details
│   ├── VariantEntryDetail.js # Individual variant details
│   ├── Info.js         # About page
│   └── ApiDocs.js      # API documentation
├── App.js              # Main app component with routing
└── index.js            # React entry point
```

## Key Features

### 1. Home Page
- Hero section with search functionality
- Registry section cards with beautiful gradients
- Submit project section
- API documentation link

### 2. Data Tables
- Grouped by gene letter (alphabetically)
- Expandable/collapsible sections
- Sortable data
- Clickable rows for detailed views
- Search functionality

### 3. Search
- Global search across all registries
- Real-time results
- Categorized results display
- No results handling

### 4. Navigation
- Sticky header with transparent background
- Mobile-responsive navigation
- Floating logo and main registry button
- Breadcrumb navigation

### 5. API Integration
- RESTful API endpoints
- Error handling
- Loading states
- CORS support

## API Endpoints

### Get Data
```
GET /api/data?table={table_name}
```

Available tables:
- `N1C_projects` - N-of-1 therapy developments
- `marketed_drugs` - Approved genetic therapies  
- `assessed_variants` - Variant assessments

### Search Data
```
GET /api/search?table={table_name}&q={search_query}
```

## Styling

The application uses a custom design system built with Tailwind CSS:

- **Primary Colors**: Red (#de3b38) for buttons and accents
- **Secondary Colors**: Blue (#042c5c) for backgrounds
- **Typography**: Inter font family
- **Components**: Custom button, card, and table styles
- **Animations**: Smooth transitions and hover effects

## Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

### Code Style

- ESLint configuration included
- Prettier formatting
- Component-based architecture
- Custom hooks for data fetching

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect GitHub repository
- **Heroku**: Add buildpack and deploy
- **Static Hosting**: Upload `build` folder to any static host

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the N1C Gene Registry and follows the same licensing terms.

## Contact

For questions or support:
- Email: generegistry@n1collaborative.org
- Website: https://www.n1collaborative.org/
- Main Registry: https://generegistry.n1collaborative.org/

## Acknowledgments

- N=1 Collaborative for the original concept and data
- React community for excellent documentation
- Tailwind CSS for the utility-first CSS framework
- Framer Motion for smooth animations
