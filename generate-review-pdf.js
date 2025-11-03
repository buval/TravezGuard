const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');

async function createReviewPDF() {
  const pdfDoc = await PDFDocument.create();
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  const pageWidth = 595;
  const pageHeight = 842;
  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let yPosition = pageHeight - 80;
  const leftMargin = 60;
  const rightMargin = pageWidth - 60;
  
  const addText = (text, fontSize, font, color, x) => {
    if (yPosition < 80) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      yPosition = pageHeight - 80;
    }
    currentPage.drawText(text, {
      x: x || leftMargin,
      y: yPosition,
      size: fontSize,
      font,
      color
    });
    yPosition -= fontSize + 6;
  };
  
  const addCenteredText = (text, fontSize, font, color) => {
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    addText(text, fontSize, font, color, (pageWidth - textWidth) / 2);
  };

  const wrapText = (text, fontSize, font, maxWidth) => {
    const words = text.split(' ');
    let line = '';
    for (const word of words) {
      const testLine = line + word + ' ';
      if (font.widthOfTextAtSize(testLine, fontSize) > maxWidth) {
        if (line) addText(line.trim(), fontSize, font, rgb(0, 0, 0));
        line = word + ' ';
      } else {
        line = testLine;
      }
    }
    if (line.trim()) addText(line.trim(), fontSize, font, rgb(0, 0, 0));
  };
  
  // Title Page
  addCenteredText('TRAVEZ', 36, helveticaBold, rgb(0.1, 0.3, 0.9));
  yPosition -= 5;
  addCenteredText('Travel Planning Application', 18, helvetica, rgb(0.4, 0.4, 0.4));
  yPosition -= 10;
  addCenteredText('Feature Review & Capabilities', 14, helvetica, rgb(0.5, 0.5, 0.5));
  yPosition -= 30;
  
  // Overview
  addText('Overview', 20, helveticaBold, rgb(0.1, 0.2, 0.7));
  yPosition += 4;
  wrapText('Travez is a comprehensive, mobile-first Progressive Web App (PWA) designed to revolutionize travel planning. Built with modern web technologies, Travez combines destination discovery, real-time flight search, visa requirement checking, and detailed trip management into a single, elegant platform.', 11, helvetica, rightMargin - leftMargin);
  yPosition -= 15;
  
  // Core Features
  addText('Core Features', 20, helveticaBold, rgb(0.1, 0.2, 0.7));
  yPosition += 4;
  
  const features = [
    {
      title: '1. Destination Discovery',
      points: [
        '• Curated collection of 25 stunning global destinations',
        '• Beautiful AI-generated destination photography',
        '• Search across thousands of cities via Amadeus API integration',
        '• Advanced category filtering (Beach, Mountain, City, Cultural, Adventure)',
        '• Detailed destination information including climate, visa requirements, and best travel months',
        '• Real-time Tours & Activities powered by Amadeus API',
        '• Geographic coordinates for precise location mapping'
      ]
    },
    {
      title: '2. Real-Time Flight Search',
      points: [
        '• Professional flight search powered by Amadeus Travel API',
        '• Smart airport autocomplete with global coverage',
        '• One-way and round-trip flight options',
        '• Intelligent flight diversification algorithm (direct, 1-stop, 2+ stops)',
        '• Detailed flight information: airline names, aircraft types, duration',
        '• Comprehensive flight details dialog with segment breakdown',
        '• Baggage allowance information with visual badges',
        '• Interactive airport information dialogs',
        '• Professional UI comparable to major booking platforms'
      ]
    },
    {
      title: '3. Multi-Step Flight Booking System',
      points: [
        '• Professional booking wizard with progress indicator',
        '• Step 1: Passenger details with form validation',
        '• Step 2: Review booking with price breakdown',
        '• Step 3: Demo payment processing (Stripe-ready)',
        '• Step 4: Booking confirmation with reference number',
        '• International flight detection for passport requirements',
        '• Seat preference selection (window/aisle)',
        '• Always-visible flight summary throughout booking',
        '• Database schema ready for production bookings'
      ]
    },
    {
      title: '4. Visa Requirements & Border Information',
      points: [
        '• Real-time visa requirement checks via Passport Index API',
        '• 20+ passport nationality options',
        '• Color-coded visa status (Visa-free, On-arrival, Required)',
        '• Stay duration information for each destination',
        '• Home country detection with friendly messaging',
        '• Complete coverage for all 25 destinations',
        '• User-friendly error handling for unavailable data'
      ]
    },
    {
      title: '5. Trip Planning & Management',
      points: [
        '• Create and manage multiple trips',
        '• Day-by-day itinerary planning',
        '• Activity scheduling with time and location details',
        '• Multiple activity types (dining, accommodation, transport, activities)',
        '• Trip notes and custom descriptions',
        '• Budget tracking with expense categorization',
        '• Real-time expense totals and budget monitoring',
        '• Trip editing and deletion capabilities'
      ]
    }
  ];
  
  for (const feature of features) {
    if (yPosition < 200) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      yPosition = pageHeight - 80;
    }
    addText(feature.title, 13, helveticaBold, rgb(0.15, 0.2, 0.4));
    for (const point of feature.points) {
      addText(point, 10, helvetica, rgb(0, 0, 0));
    }
    yPosition -= 10;
  }
  
  // New page for technical details
  currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  yPosition = pageHeight - 80;
  
  addText('Technical Architecture', 20, helveticaBold, rgb(0.1, 0.2, 0.7));
  yPosition += 4;
  
  addText('Frontend Technologies', 13, helveticaBold, rgb(0.15, 0.2, 0.4));
  const frontendTech = [
    '• React 18 with TypeScript for type-safe component development',
    '• Vite for lightning-fast development and optimized builds',
    '• TanStack Query (React Query) for efficient server state management',
    '• Wouter for lightweight client-side routing',
    '• shadcn/ui component library built on Radix UI primitives',
    '• Tailwind CSS for utility-first responsive styling',
    '• React Hook Form with Zod validation for robust forms',
    '• Lucide React for modern iconography',
    '• date-fns for date manipulation and formatting',
    '• Progressive Web App (PWA) with offline support'
  ];
  frontendTech.forEach(tech => addText(tech, 10, helvetica, rgb(0, 0, 0)));
  yPosition -= 10;
  
  addText('Backend Technologies', 13, helveticaBold, rgb(0.15, 0.2, 0.4));
  const backendTech = [
    '• Node.js with Express for RESTful API',
    '• TypeScript throughout for end-to-end type safety',
    '• PostgreSQL (Neon) for reliable data persistence',
    '• Drizzle ORM for type-safe database queries',
    '• Passport.js for authentication (local strategy)',
    '• express-session with PostgreSQL session store',
    '• Secure password hashing using Node.js crypto (scrypt)'
  ];
  backendTech.forEach(tech => addText(tech, 10, helvetica, rgb(0, 0, 0)));
  yPosition -= 10;
  
  addText('External API Integrations', 13, helveticaBold, rgb(0.15, 0.2, 0.4));
  const apis = [
    '• Amadeus Travel API: Flight search, airport data, tours & activities',
    '• Passport Index API: Real-time visa requirements',
    '• Unsplash API: High-quality destination photography',
    '• OAuth 2.0 token management with intelligent caching'
  ];
  apis.forEach(api => addText(api, 10, helvetica, rgb(0, 0, 0)));
  yPosition -= 15;
  
  // User Experience
  addText('User Experience Highlights', 20, helveticaBold, rgb(0.1, 0.2, 0.7));
  yPosition += 4;
  
  const uxFeatures = [
    '• Mobile-first responsive design optimized for all devices',
    '• Bottom navigation bar for easy thumb-friendly access',
    '• Persistent session management for seamless experience',
    '• Guest browsing with authentication for personalized features',
    '• Intelligent form validation with helpful error messages',
    '• Loading states and skeleton screens for perceived performance',
    '• Debounced search to reduce API calls and improve performance',
    '• Toast notifications for user feedback',
    '• Dark mode support throughout the application',
    '• Accessible UI components meeting WCAG guidelines'
  ];
  uxFeatures.forEach(feature => addText(feature, 10, helvetica, rgb(0, 0, 0)));
  yPosition -= 15;
  
  // Database Schema
  addText('Database Structure', 20, helveticaBold, rgb(0.1, 0.2, 0.7));
  yPosition += 4;
  
  const dbTables = [
    'users - User accounts with authentication credentials',
    'sessions - Session management for authentication',
    'destinations - 25 curated travel destinations with metadata',
    'trips - User-created trips with dates and budgets',
    'itineraryItems - Day-by-day trip activities and plans',
    'expenses - Trip expense tracking with categorization',
    'flightBookings - Flight reservation records (demo mode)',
    'passengers - Passenger information for flight bookings'
  ];
  dbTables.forEach(table => addText('• ' + table, 10, helvetica, rgb(0, 0, 0)));
  yPosition -= 15;
  
  // Security & Best Practices
  addText('Security & Best Practices', 20, helveticaBold, rgb(0.1, 0.2, 0.7));
  yPosition += 4;
  
  const security = [
    '• Secure password hashing using scrypt algorithm',
    '• Session-based authentication with secure cookies',
    '• SQL injection protection via parameterized queries',
    '• Type-safe database operations with Drizzle ORM',
    '• Environment variable management for API keys',
    '• CORS configuration for API security',
    '• Input validation on both client and server',
    '• Prepared statements for all database queries'
  ];
  security.forEach(item => addText('• ' + item, 10, helvetica, rgb(0, 0, 0)));
  yPosition -= 15;
  
  // Current Status & Future Enhancements
  addText('Current Status', 20, helveticaBold, rgb(0.1, 0.2, 0.7));
  yPosition += 4;
  
  const status = [
    '✓ Fully functional destination discovery and browsing',
    '✓ Real-time flight search with professional UI',
    '✓ Complete trip planning and itinerary management',
    '✓ Comprehensive visa requirement checking',
    '✓ Budget tracking and expense management',
    '✓ Multi-step flight booking wizard (demo mode)',
    '✓ User authentication and session management',
    '✓ PWA capabilities with offline support',
    '✓ Responsive design across all devices',
    '✓ Production-ready database schema'
  ];
  status.forEach(item => addText(item, 10, helvetica, rgb(0, 0, 0)));
  yPosition -= 15;
  
  addText('Ready for Production Enhancement', 13, helveticaBold, rgb(0.15, 0.2, 0.4));
  const enhancements = [
    '• Stripe payment integration for live bookings',
    '• Email confirmation system for bookings',
    '• Enhanced seat selection with visual seat maps',
    '• Hotel and car rental integration',
    '• Social features (trip sharing, recommendations)',
    '• Mobile app versions (iOS/Android)',
    '• Advanced analytics and reporting',
    '• Multi-language support',
    '• Travel insurance integration',
    '• Loyalty program features'
  ];
  enhancements.forEach(item => addText('• ' + item, 10, helvetica, rgb(0, 0, 0)));
  
  // Footer
  yPosition = 60;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  addCenteredText('Travez - Making Travel Planning Effortless', 10, helvetica, rgb(0.5, 0.5, 0.5));
  addCenteredText(`Generated on ${date}`, 9, helvetica, rgb(0.6, 0.6, 0.6));
  
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('Travez-Application-Review.pdf', pdfBytes);
  console.log('PDF created successfully: Travez-Application-Review.pdf');
}

createReviewPDF().catch(console.error);
