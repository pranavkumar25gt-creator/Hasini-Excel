/**
 * Script to verify all YouTube video IDs in curriculum.ts via oEmbed API.
 * A 200 response = public, valid video.
 */

export const CURRICULUM_DATA = [
  {
    day: 1,
    title: 'Setup & Interface Tour',
    subtitle: 'Installing Excel, Ribbon navigation, workbook anatomy, entering data & AutoFill',
    week: 1,
    weekTitle: 'Foundations',
    goals: [
      'Download and set up Microsoft 365 or open free Excel on the Web',
      'Understand workbooks, worksheets, rows, columns, and cell addresses',
      'Enter and edit text, numbers, and dates accurately',
      'Master the AutoFill handle for sequences, days, and months'
    ],
    hindi: {
      videoId: '09FlqkANCws',
      backups: ['ZcAM8uClHGY', '3kNEv3s8TuA'],
      channel: 'WsCube Tech',
      durationApprox: '35 min'
    },
    english: {
      videoId: '5oj3VerIz2E',
      backups: ['sGUlARfE6IM', 'Ai0MV7twEBE'],
      channel: 'Microsoft Community / Kevin Stratvert',
      durationApprox: '30 min'
    },
    keyPoints: [
      'Excel on Web is 100% free with a free Microsoft account at office.com',
      'The Formula Bar displays the true cell contents, while the cell shows formatted values',
      'Double-clicking the bottom-right corner of a cell auto-fills data down to match adjacent rows',
      'Press Ctrl+Z immediately to undo any mistake — never panic in a workbook'
    ],
    practice: {
      task: 'Build your first 7-day personal expense tracking sheet',
      instructions: [
        'Create columns: Date, Category, Description, and Amount (₹)',
        'Enter 7 rows of daily expenses using AutoFill for the dates',
        'Type your first formula: =SUM(D2:D8) at the bottom',
        'Save the file as "Day1_MyFirstExcel.xlsx"'
      ],
      sampleData: [
        ['Date', 'Category', 'Description', 'Amount (INR)'],
        ['2026-11-01', 'Groceries', 'Supermarket vegetables', '450'],
        ['2026-11-02', 'Transit', 'Metro smart card recharge', '200'],
        ['2026-11-03', 'Dining', 'Coffee with friend', '180'],
        ['2026-11-04', 'Utilities', 'Mobile phone bill', '399'],
        ['2026-11-05', 'Groceries', 'Fruits & milk', '320'],
        ['2026-11-06', 'Books', 'Stationery notebook', '150'],
        ['2026-11-07', 'Entertainment', 'Weekend movie ticket', '350']
      ],
      expectedOutcome: 'A clean 4-column sheet with proper date formatting and a working =SUM() total.'
    }
  },
  {
    day: 2,
    title: 'Formatting & Number Types',
    subtitle: 'Fonts, cell borders, Indian Rupee currency, percentages, date formatting & alignment',
    week: 1,
    weekTitle: 'Foundations',
    goals: [
      'Format numbers as Indian Currency (₹), decimals, and percentages',
      'Apply custom cell borders, fills, and typographic hierarchy',
      'Use Wrap Text and Merge & Center (and learn why Center Across Selection is better)',
      'Use Format Painter to instantly copy visual styling across cells'
    ],
    hindi: {
      videoId: 'ZcAM8uClHGY',
      backups: ['09FlqkANCws', 'LEaqqDgMQmE'],
      channel: 'WsCube Tech',
      durationApprox: '40 min'
    },
    english: {
      videoId: 'poM2n8fBcag',
      backups: ['Ai0MV7twEBE', 'k1VUZEVuDJ8'],
      channel: 'Kevin Stratvert',
      durationApprox: '35 min'
    },
    keyPoints: [
      'Never type currency symbols manually into numbers; format cells with Currency/Accounting',
      'Excel stores dates as serial numbers (Day 1 is 1900-01-01)',
      'Use Alt + Enter inside a cell to insert a line break without leaving the cell',
      'Format Painter double-click locks it for pasting onto multiple targets'
    ],
    practice: {
      task: 'Design an editorial invoice header and pricing schedule',
      instructions: [
        'Apply INR currency format (₹) with 2 decimal places to amount columns',
        'Add soft blush/cream header styling with dark plum text and subtle borders',
        'Format discount rates as clean percentages (e.g., 10%)',
        'Use Format Painter to style alternating summary cards'
      ],
      sampleData: [
        ['Item Code', 'Service Description', 'Rate (INR)', 'Discount', 'Net Total'],
        ['PR-101', 'Editorial Brand Design', '15000', '0.10', '=C2*(1-D2)'],
        ['PR-102', 'Social Media Strategy Kit', '8500', '0.05', '=C3*(1-D3)'],
        ['PR-103', 'Copywriting & Content Guide', '6000', '0.00', '=C4*(1-D4)']
      ],
      expectedOutcome: 'An elegant, magazine-grade invoice table with properly formatted rupee values.'
    }
  },
  {
    day: 3,
    title: 'Core Formulas & Cell References',
    subtitle: 'SUM, AVERAGE, MIN, MAX, COUNT & the secret power of Dollar signs ($A$1)',
    week: 1,
    weekTitle: 'Foundations',
    goals: [
      'Write math formulas using +, -, *, /, and parentheses',
      'Calculate sums, averages, minimums, and maximums with standard functions',
      'Distinguish COUNT (numbers only) vs COUNTA (all non-empty cells)',
      'Master Relative references (A1), Absolute references ($A$1), and Mixed references ($A1, A$1)'
    ],
    hindi: {
      videoId: 'LEaqqDgMQmE',
      backups: ['TFB3duruFI8', 'XBBv2C8L6UY'],
      channel: 'My E-Lesson',
      durationApprox: '45 min'
    },
    english: {
      videoId: 'Y8xhrUa3KH4',
      backups: ['ZwiQ0W5lTEg', 'Vl0H-qTclOg'],
      channel: 'Kevin Stratvert',
      durationApprox: '45 min'
    },
    keyPoints: [
      'Press F4 while editing a formula reference to toggle between A1 -> $A$1 -> A$1 -> $A1',
      'Relative references move when copied; absolute references stay fixed on the specific cell',
      'COUNT ignores blank cells and text strings; use COUNTA to count names or text',
      'Formula errors: #DIV/0! (divided by zero), #VALUE! (wrong data type)'
    ],
    practice: {
      task: 'Calculate sales commission for 5 team members using a fixed commission rate',
      instructions: [
        'Place the commission rate (8.5%) in cell B1',
        'Create a table of Sales Rep, Region, Total Sales',
        'In Commission column, multiply Total Sales by $B$1 using absolute reference',
        'Compute SUM, AVERAGE, MAX, and MIN for the team'
      ],
      sampleData: [
        ['Commission Rate', '0.085', '', ''],
        ['Rep Name', 'Region', 'Gross Sales', 'Commission'],
        ['Ananya', 'Mumbai', '125000', '=C3*$B$1'],
        ['Diya', 'Delhi', '98000', '=C4*$B$1'],
        ['Ishaan', 'Bengaluru', '145000', '=C5*$B$1'],
        ['Meera', 'Chennai', '112000', '=C6*$B$1']
      ],
      expectedOutcome: 'Working formulas that calculate commissions correctly when dragged down.'
    }
  },
  {
    day: 4,
    title: 'Text & Date Functions',
    subtitle: 'Cleaning messy text with LEFT, RIGHT, MID, TRIM, CONCAT, TEXTJOIN & TODAY',
    week: 1,
    weekTitle: 'Foundations',
    goals: [
      'Clean unwanted leading/trailing spaces using TRIM and PROPER',
      'Extract substrings using LEFT, RIGHT, and MID',
      'Combine names and addresses smoothly using CONCAT and TEXTJOIN',
      'Work with live dates using TODAY(), NOW(), and calculate durations with DATEDIF'
    ],
    hindi: {
      videoId: 'XBBv2C8L6UY',
      backups: ['RXv_uIN6e-Y', 'TFB3duruFI8'],
      channel: 'Excel Superstar',
      durationApprox: '35 min'
    },
    english: {
      videoId: '9sEd1_8qG-U',
      backups: ['Y8xhrUa3KH4', 'Vl0H-qTclOg'],
      channel: 'Kevin Stratvert',
      durationApprox: '35 min'
    },
    keyPoints: [
      'TRIM removes irregular spacing but keeps single spaces between words',
      'PROPER capitalizes the first letter of each word (great for Indian names)',
      'TEXTJOIN allows a delimiter like ", " and lets you ignore empty cells',
      'TODAY() takes no arguments and recalculates whenever the sheet updates'
    ],
    practice: {
      task: 'Clean a customer list with scrambled names and format their full addresses',
      instructions: [
        'Use PROPER(TRIM(cell)) to standardize names',
        'Use TEXTJOIN(", ", TRUE, Street, City, Pincode) to build shipping labels',
        'Calculate age in years using =DATEDIF(BirthDate, TODAY(), "Y")',
        'Extract 6-digit Pincodes from address strings using RIGHT(cell, 6)'
      ],
      sampleData: [
        ['Raw Name', 'City', 'Pincode', 'Clean Name', 'Full Label'],
        ['  priya sharma  ', 'Mumbai', '400050', '=PROPER(TRIM(A2))', '=TEXTJOIN(", ", TRUE, D2, B2, C2)'],
        ['ROHAN VERMA', 'Pune', '411001', '=PROPER(TRIM(A3))', '=TEXTJOIN(", ", TRUE, D3, B3, C3)'],
        ['kavita   nair ', 'Kochi', '682001', '=PROPER(TRIM(A4))', '=TEXTJOIN(", ", TRUE, D4, B4, C4)']
      ],
      expectedOutcome: 'Standardized customer directory with clean casing and unified address labels.'
    }
  },
  {
    day: 5,
    title: 'Tables, Sorting & Filtering',
    subtitle: 'The magic of Excel Tables (Ctrl+T), multi-level sorting & custom text filters',
    week: 1,
    weekTitle: 'Foundations',
    goals: [
      'Convert normal data ranges into dynamic Excel Tables (Ctrl+T)',
      'Sort datasets by multiple columns (e.g. Department, then Salary descending)',
      'Apply custom text, number, and date filters',
      'Remove duplicate rows safely and enable the automatic Total Row'
    ],
    hindi: {
      videoId: '3kNEv3s8TuA',
      backups: ['ZcAM8uClHGY', '09FlqkANCws'],
      channel: 'My E-Lesson',
      durationApprox: '35 min'
    },
    english: {
      videoId: '_bPNG0x2k6c',
      backups: ['rHfz55exCyM', 'poM2n8fBcag'],
      channel: 'Leila Gharani',
      durationApprox: '30 min'
    },
    keyPoints: [
      'Excel Tables automatically expand when you add new rows or columns below them',
      'Formulas in tables use structured references like [@Salary] instead of cell coordinates',
      'Press Ctrl+Shift+L to toggle Filter arrows on any data range',
      'Table Total Row provides instant dropdowns for SUM, AVERAGE, and COUNT without writing formulas'
    ],
    practice: {
      task: 'Convert an inventory list into an official Excel Table with automatic totals',
      instructions: [
        'Select data and press Ctrl+T (check "My table has headers")',
        'Sort by Category (A-Z) and Quantity in Stock (Largest to Smallest)',
        'Filter to show only items with stock below 20 units',
        'Enable Total Row and set total valuation to SUM'
      ],
      sampleData: [
        ['SKU', 'Item Name', 'Category', 'Unit Price', 'In Stock'],
        ['SKU-01', 'Silk Scarf', 'Apparel', '1800', '15'],
        ['SKU-02', 'Linen Blazer', 'Apparel', '4500', '8'],
        ['SKU-03', 'Pearl Earrings', 'Jewelry', '3200', '25'],
        ['SKU-04', 'Leather Tote', 'Accessories', '5900', '5'],
        ['SKU-05', 'Velvet Journal', 'Stationery', '750', '40']
      ],
      expectedOutcome: 'An interactive Excel Table with banded rows, active filters, and summary totals.'
    }
  },
  {
    day: 6,
    title: 'Shortcuts, Freeze Panes & Print Setup',
    subtitle: 'Navigate at speed: 15 essential keyboard shortcuts, locking headers & print layout',
    week: 1,
    weekTitle: 'Foundations',
    goals: [
      'Memorize and apply 10+ high-frequency productivity keyboard shortcuts',
      'Lock top rows and first columns with Freeze Panes so headers never disappear',
      'Configure Print Area, Fit to 1 Page Wide, and repeat header rows on every page',
      'Use Page Break Preview to prepare professional print-ready reports'
    ],
    hindi: {
      videoId: 'maJ0t1zOfko',
      backups: ['8-s9BCpVdAs', 'ZcAM8uClHGY'],
      channel: 'Excel Superstar',
      durationApprox: '30 min'
    },
    english: {
      videoId: 'T5vSDAX1HjY',
      backups: ['poM2n8fBcag', 'k1VUZEVuDJ8'],
      channel: 'Kevin Stratvert',
      durationApprox: '30 min'
    },
    keyPoints: [
      'Ctrl + Arrow keys jump to the edge of data; Ctrl + Shift + Arrow selects to the edge',
      'Ctrl + Space selects the entire column; Shift + Space selects the entire row',
      'View -> Freeze Panes locks cells above and to the left of your active selection',
      'Page Layout -> Print Titles allows repeating Row 1 at the top of every printed page'
    ],
    practice: {
      task: 'Prepare a 50-row employee directory for presentation and printing',
      instructions: [
        'Navigate using only Ctrl+Arrow shortcuts without touching the mouse',
        'Freeze the top 2 header rows using View -> Freeze Panes',
        'Set Page Orientation to Landscape and Margins to Narrow',
        'Set Page Setup to "Fit to 1 Page Wide" and verify in Print Preview'
      ],
      sampleData: [
        ['ID', 'Full Name', 'Department', 'Location', 'Joining Year', 'Annual CTC'],
        ['E-101', 'Aditi Rao', 'Marketing', 'Bengaluru', '2021', '1400000'],
        ['E-102', 'Nikhil Joshi', 'Engineering', 'Hyderabad', '2020', '2200000'],
        ['E-103', 'Tara Sen', 'Design', 'Mumbai', '2022', '1600000'],
        ['E-104', 'Vikram Patel', 'Finance', 'Ahmedabad', '2019', '1900000']
      ],
      expectedOutcome: 'A freeze-pane locked sheet that prints cleanly across pages with repeated headers.'
    }
  },
  {
    day: 7,
    title: 'Foundations Mini-Project',
    subtitle: 'Week 1 Milestone: Building an end-to-end Personal Budget & Student Marksheet',
    week: 1,
    weekTitle: 'Foundations',
    goals: [
      'Synthesize all Week 1 skills into two real-world operational workbooks',
      'Design a 12-month personal budget tracker with income, savings, and expense categories',
      'Build a student marksheet with totals, percentages, class ranks, and pass/fail indicators',
      'Apply professional color palettes, clean borders, and freeze panes'
    ],
    hindi: {
      videoId: 'SA_SDo-cqpg',
      backups: ['ZcAM8uClHGY', 'TFB3duruFI8'],
      channel: 'WsCube Tech',
      durationApprox: '50 min'
    },
    english: {
      videoId: 'k1VUZEVuDJ8',
      backups: ['poM2n8fBcag', 'Vl0H-qTclOg'],
      channel: 'Teacher\'s Tech',
      durationApprox: '45 min'
    },
    keyPoints: [
      'Always separate input assumptions from calculation formulas',
      'Use SUM and AVERAGE across student subjects to get aggregate performance',
      'Format total rows with a top thin border and double bottom border (accounting standard)',
      'Celebrate completing Week 1 — you now know more Excel than 70% of office workers'
    ],
    practice: {
      task: 'Build the Week 1 Capstone Marksheet with 5 students across 5 subjects',
      instructions: [
        'Include columns for Math, Science, English, History, and Computer Science (max 100 each)',
        'Calculate Total Marks (=SUM) and Percentage (=Total/500)',
        'Compute Class Average, Highest Mark (MAX), and Lowest Mark (MIN)',
        'Format the entire sheet with rose & cream styling and save as "Week1_Milestone.xlsx"'
      ],
      sampleData: [
        ['Student', 'Math', 'Science', 'English', 'History', 'CompSci', 'Total', 'Percentage'],
        ['Aarav', '92', '88', '79', '85', '95', '=SUM(B2:F2)', '=G2/500'],
        ['Bhavna', '76', '84', '91', '88', '82', '=SUM(B3:F3)', '=G3/500'],
        ['Chirag', '85', '79', '72', '68', '90', '=SUM(B4:F4)', '=G4/500'],
        ['Divya', '95', '94', '89', '92', '98', '=SUM(B5:F5)', '=G5/500']
      ],
      expectedOutcome: 'A complete, polished marksheet with automatic totals, percentages, and summary metrics.'
    }
  },
  {
    day: 8,
    title: 'Logical Functions: IF, Nested IF & IFS',
    subtitle: 'Making decisions in spreadsheets with IF, AND, OR & handling tiered conditions',
    week: 2,
    weekTitle: 'Analysis',
    goals: [
      'Master the 3 arguments of the IF function: condition, value_if_true, value_if_false',
      'Combine multiple conditions using AND() and OR() inside an IF statement',
      'Handle multi-tier grading/bonus structures using modern IFS() and nested IFs',
      'Prevent ugly formula errors using IFERROR()'
    ],
    hindi: {
      videoId: 'XBBv2C8L6UY',
      backups: ['RXv_uIN6e-Y', 'ZcAM8uClHGY'],
      channel: 'Excel Superstar',
      durationApprox: '40 min'
    },
    english: {
      videoId: 'fM8oGBaIzlE',
      backups: ['DE7OUM18QAk', 'Y8xhrUa3KH4'],
      channel: 'Kevin Stratvert',
      durationApprox: '40 min'
    },
    keyPoints: [
      'Syntax: =IF(logical_test, [value_if_true], [value_if_false])',
      '=AND(condition1, condition2) returns TRUE only when all tests pass',
      '=IFS(score>=90, "A", score>=75, "B", score>=60, "C", TRUE, "D") is cleaner than nested IFs',
      'Wrap tricky formulas with =IFERROR(formula, "Alternative Value") to avoid #N/A'
    ],
    practice: {
      task: 'Build a tiered performance appraisal & bonus calculation system',
      instructions: [
        'Award "Eligible" if Attendance >= 90% AND Rating >= 4, else "Review"',
        'Calculate Bonus %: >=5 Star: 20%, >=4 Star: 12%, >=3 Star: 5%, else 0%',
        'Wrap with IFERROR to handle incomplete employee records smoothly',
        'Verify test cases with varied ratings'
      ],
      sampleData: [
        ['Emp Name', 'Attendance %', 'Rating', 'Status', 'Bonus %'],
        ['Rhea', '0.94', '5', '=IF(AND(B2>=0.9,C2>=4),"Eligible","Review")', '=IFS(C2>=5,0.2,C2>=4,0.12,C2>=3,0.05,TRUE,0)'],
        ['Kabir', '0.88', '4', '=IF(AND(B3>=0.9,C3>=4),"Eligible","Review")', '=IFS(C3>=5,0.2,C3>=4,0.12,C3>=3,0.05,TRUE,0)'],
        ['Sneha', '0.96', '3', '=IF(AND(B4>=0.9,C4>=4),"Eligible","Review")', '=IFS(C4>=5,0.2,C4>=4,0.12,C4>=3,0.05,TRUE,0)']
      ],
      expectedOutcome: 'Automated decision columns with zero formula errors.'
    }
  },
  {
    day: 9,
    title: 'Lookup Mastery: VLOOKUP & XLOOKUP',
    subtitle: 'Connecting disparate data tables with VLOOKUP, modern XLOOKUP & INDEX-MATCH',
    week: 2,
    weekTitle: 'Analysis',
    goals: [
      'Understand how VLOOKUP searches the leftmost column and fetches values to the right',
      'Always specify FALSE (or 0) for exact match in VLOOKUP to prevent dangerous errors',
      'Master XLOOKUP (the modern replacement): 2-way lookups, searching backwards, default values',
      'Learn classical INDEX-MATCH as a bulletproof alternative that never breaks when columns move'
    ],
    hindi: {
      videoId: 'h2sCO6iYCF8',
      backups: ['XBBv2C8L6UY', 'SA_SDo-cqpg'],
      channel: 'Deepak Jhanswa / Excel Superstar',
      durationApprox: '45 min'
    },
    english: {
      videoId: 'xIynD1gFOLo',
      backups: ['TDphx23AtqM', '4c0CLUER6nw'],
      channel: 'Kevin Stratvert',
      durationApprox: '40 min'
    },
    keyPoints: [
      'VLOOKUP limitation: cannot look to the left of the lookup column; XLOOKUP can',
      'XLOOKUP syntax: =XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found])',
      'INDEX-MATCH: =INDEX(return_range, MATCH(lookup_val, lookup_range, 0))',
      'XLOOKUP does not require counting column numbers, making sheets resilient to edits'
    ],
    practice: {
      task: 'Automate a retail billing register that pulls product details by Barcode SKU',
      instructions: [
        'Create a Product Catalog sheet with SKU, Product Name, Category, and Unit Price',
        'In the Sales Order sheet, use XLOOKUP to fetch Product Name from SKU',
        'Use VLOOKUP with FALSE for exact match to fetch Unit Price',
        'Provide a friendly fallback "Item Not Found" if an unknown SKU is typed'
      ],
      sampleData: [
        ['Order ID', 'SKU', 'Item Name', 'Unit Price', 'Qty', 'Total'],
        ['ORD-501', 'SKU-01', '=XLOOKUP(B2, $H$2:$H$6, $I$2:$I$6, "Not Found")', '=VLOOKUP(B2, $H$2:$K$6, 4, FALSE)', '3', '=D2*E2'],
        ['ORD-502', 'SKU-03', '=XLOOKUP(B3, $H$2:$H$6, $I$2:$I$6, "Not Found")', '=VLOOKUP(B3, $H$2:$K$6, 4, FALSE)', '1', '=D3*E3'],
        ['ORD-503', 'SKU-99', '=XLOOKUP(B4, $H$2:$H$6, $I$2:$I$6, "Not Found")', '=VLOOKUP(B4, $H$2:$K$6, 4, FALSE)', '2', '=D4*E4']
      ],
      expectedOutcome: 'Instant automated lookup that autofills product names, prices, and totals.'
    }
  },
  {
    day: 10,
    title: 'Conditional Aggregations: SUMIF & COUNTIF',
    subtitle: 'Filtering calculations dynamically: SUMIF, SUMIFS, COUNTIF, COUNTIFS & AVERAGEIF',
    week: 2,
    weekTitle: 'Analysis',
    goals: [
      'Calculate totals for specific categories using SUMIF',
      'Count occurrences meeting conditions using COUNTIF (e.g. sales > ₹50,000)',
      'Handle multiple simultaneous criteria with SUMIFS and COUNTIFS',
      'Use wildcards (* and ?) to aggregate data with partial text matches'
    ],
    hindi: {
      videoId: 'lTT4FlkqSqc',
      backups: ['1b4zI4rZwUk', 'FrACxPTUJdo'],
      channel: 'Excel Superstar',
      durationApprox: '35 min'
    },
    english: {
      videoId: 'OpNnMH6iY4A',
      backups: ['AZuBNWMh7VM', '3ZI3xXiT94Q'],
      channel: 'Kevin Stratvert',
      durationApprox: '35 min'
    },
    keyPoints: [
      'In SUMIF, the sum_range is the last argument: =SUMIF(range, criteria, [sum_range])',
      'In SUMIFS, the sum_range is the FIRST argument: =SUMIFS(sum_range, crit_range1, crit1, ...)',
      'Text criteria must be in double quotes: =COUNTIF(C2:C100, ">50000")',
      'To reference a cell in criteria: =COUNTIF(C2:C100, ">" & G1)'
    ],
    practice: {
      task: 'Generate an executive regional summary of monthly transactions',
      instructions: [
        'Count total transactions from the "West" zone using COUNTIF',
        'Sum total revenue for "Electronics" in "North" zone using SUMIFS',
        'Calculate average order value for orders above ₹2,000 using AVERAGEIF',
        'Count how many client names begin with "A" using the wildcard "A*"'
      ],
      sampleData: [
        ['Region', 'Category', 'Order Value (INR)'],
        ['North', 'Electronics', '14500'],
        ['West', 'Fashion', '3200'],
        ['North', 'Electronics', '8900'],
        ['South', 'Home Decor', '4100'],
        ['West', 'Electronics', '12000'],
        ['North', 'Fashion', '2800']
      ],
      expectedOutcome: 'Dynamic KPI summary cards computing regional breakdowns with SUMIFS.'
    }
  },
  {
    day: 11,
    title: 'Conditional Formatting & Data Validation',
    subtitle: 'Visual data alerts: color scales, highlight rules, custom formulas & dropdown menus',
    week: 2,
    weekTitle: 'Analysis',
    goals: [
      'Create clean in-cell dropdown lists using Data Validation (List option)',
      'Restrain input errors with numeric ranges, date bounds, and custom error alerts',
      'Highlight top performers, overdue dates, and duplicates with Conditional Formatting',
      'Write custom formatting formulas to highlight entire rows based on a cell value'
    ],
    hindi: {
      videoId: 'zYgst_jjd-I',
      backups: ['XBBv2C8L6UY', 'SA_SDo-cqpg'],
      channel: 'Excel Superstar',
      durationApprox: '40 min'
    },
    english: {
      videoId: 'Jp29JYGq5Hw',
      backups: ['XHT4paRaY4g', 'poM2n8fBcag'],
      channel: 'Kevin Stratvert',
      durationApprox: '35 min'
    },
    keyPoints: [
      'Data Validation dropdown: Data -> Data Validation -> Allow: List -> Source: =$G$2:$G$6',
      'To highlight an entire row, lock the column coordinate with a dollar sign: =$E2="Complete"',
      'Soft pastel color fills look editorial and premium; avoid harsh neon reds and greens',
      'Clear Rules -> Clear Rules from Entire Sheet when formatting gets messy'
    ],
    practice: {
      task: 'Build a luxury project tracking sheet with status dropdowns and row highlighting',
      instructions: [
        'Create a status dropdown: "Not Started", "In Progress", "In Review", "Delivered"',
        'Add a custom formula rule to tint the entire row soft green when Status = "Delivered"',
        'Add data bars to the "Progress %" column',
        'Highlight tasks past due date in soft rose blush'
      ],
      sampleData: [
        ['Task ID', 'Deliverable Name', 'Due Date', 'Status', 'Progress %'],
        ['TSK-1', 'Editorial Moodboard', '2026-11-15', 'Delivered', '1.00'],
        ['TSK-2', 'Excel Financial Model', '2026-11-18', 'In Review', '0.75'],
        ['TSK-3', 'Client Brand Presentation', '2026-11-20', 'In Progress', '0.40'],
        ['TSK-4', 'Final Invoice Dispatch', '2026-11-25', 'Not Started', '0.00']
      ],
      expectedOutcome: 'A clean project dashboard that dynamically tints rows based on status dropdowns.'
    }
  },
  {
    day: 12,
    title: 'Charts & Data Visualization',
    subtitle: 'Column, line, combo charts, sparklines & magazine-worthy design principles',
    week: 2,
    weekTitle: 'Analysis',
    goals: [
      'Select the right visual for the story: column (compare), line (trends), combo (dual axis)',
      'Create and customize clean charts without chart clutter or default ugly designs',
      'Add in-cell mini trendlines with Sparklines',
      'Format titles, data labels, legend placement, and subdued gridlines'
    ],
    hindi: {
      videoId: 'IpQewCnYBGY',
      backups: ['tNzscQqGFcQ', 'Bg3F8u7FfLE'],
      channel: 'Excel Superstar',
      durationApprox: '40 min'
    },
    english: {
      videoId: 'eHtZrIb0oWY',
      backups: ['poM2n8fBcag', 'k1VUZEVuDJ8'],
      channel: 'Kevin Stratvert',
      durationApprox: '35 min'
    },
    keyPoints: [
      'Press Alt + F1 to instantly create a default column chart from selected data',
      'Less is more: remove heavy black borders, soften gridlines to 20% opacity',
      'Use a Combo Chart (Line on Secondary Axis) to show Revenue alongside Profit Margin %',
      'Sparklines: Insert -> Sparklines -> Line (fits inside a single cell for trend overviews)'
    ],
    practice: {
      task: 'Design an executive sales trend chart with revenue bars and margin line',
      instructions: [
        'Plot 12 months of Sales Revenue and Profit Margin %',
        'Create a Combo Chart: Clustered Column for Sales, Line for Profit % on Secondary Axis',
        'Apply rose & champagne gold styling; remove background vertical gridlines',
        'Insert Sparklines in a summary comparison column'
      ],
      sampleData: [
        ['Month', 'Revenue (Lakh INR)', 'Profit Margin %'],
        ['Jan', '18.5', '0.22'],
        ['Feb', '22.1', '0.24'],
        ['Mar', '28.4', '0.29'],
        ['Apr', '24.0', '0.25'],
        ['May', '31.2', '0.31'],
        ['Jun', '35.8', '0.33']
      ],
      expectedOutcome: 'A magazine-caliber combo chart with dual axes and harmonious color palette.'
    }
  },
  {
    day: 13,
    title: 'PivotTables Foundations',
    subtitle: 'Summarizing 10,000 rows in 30 seconds: rows, columns, values, filters & slicers',
    week: 2,
    weekTitle: 'Analysis',
    goals: [
      'Understand the architecture of a PivotTable: Rows, Columns, Values, and Filters',
      'Create your first PivotTable from an Excel Table in two clicks',
      'Change value summarization from SUM to AVERAGE, COUNT, or % of Column Total',
      'Group dates by Years, Quarters, and Months automatically',
      'Add interactive visual Slicers for rapid one-click filtering'
    ],
    hindi: {
      videoId: 't2RXV91OEHk',
      backups: ['SA_SDo-cqpg', 'ZcAM8uClHGY'],
      channel: 'Excel Superstar',
      durationApprox: '45 min'
    },
    english: {
      videoId: 'dvbLrwD2SpA',
      backups: ['3g1CSG5zvQ0', 'F9WgF1K_K2g'],
      channel: 'Kevin Stratvert',
      durationApprox: '40 min'
    },
    keyPoints: [
      'Always convert source data to an Excel Table (Ctrl+T) before creating a PivotTable',
      'Right-click any date inside the PivotTable -> Group -> select Months and Years',
      'Right-click any number -> Value Field Settings -> Number Format to format properly',
      'Click PivotTable Analyze -> Insert Slicer for elegant interactive buttons'
    ],
    practice: {
      task: 'Analyze 500 rows of Indian retail transactions by region, category, and payment mode',
      instructions: [
        'Place "Region" in Rows, "Category" in Columns, and "Sales Amount" in Values',
        'Change one summary field to show % of Grand Total',
        'Insert Slicers for "Payment Mode" (UPI, Credit Card, Net Banking) and "Year"',
        'Format numbers in Indian Lakhs / Currency with commas'
      ],
      sampleData: [
        ['Date', 'Region', 'Category', 'Payment Mode', 'Sales (INR)'],
        ['2026-01-12', 'South', 'Electronics', 'UPI', '42000'],
        ['2026-01-14', 'North', 'Fashion', 'Credit Card', '18500'],
        ['2026-01-15', 'West', 'Beauty', 'UPI', '7800'],
        ['2026-01-18', 'South', 'Home', 'Net Banking', '26400'],
        ['2026-01-20', 'North', 'Electronics', 'UPI', '59000']
      ],
      expectedOutcome: 'An interactive PivotTable with cross-filtering slicers and percentage totals.'
    }
  },
  {
    day: 14,
    title: 'Analysis Mini-Project',
    subtitle: 'Week 2 Milestone: Comprehensive Sales Analysis Report with Pivots, Slicers & Charts',
    week: 2,
    weekTitle: 'Analysis',
    goals: [
      'Integrate VLOOKUP/XLOOKUP, SUMIFS, PivotTables, and Charts into a client-facing report',
      'Generate regional performance matrices and product category breakdowns',
      'Build linked Slicers controlling multiple PivotTables simultaneously',
      'Deliver an interactive 2-page report ready for management review'
    ],
    hindi: {
      videoId: 'SA_SDo-cqpg',
      backups: ['Bg3F8u7FfLE', 'ZcAM8uClHGY'],
      channel: 'WsCube Tech',
      durationApprox: '55 min'
    },
    english: {
      videoId: 'F9WgF1K_K2g',
      backups: ['dvbLrwD2SpA', 'k1VUZEVuDJ8'],
      channel: 'Leila Gharani',
      durationApprox: '45 min'
    },
    keyPoints: [
      'Report Connections: Right-click Slicer -> Report Connections to connect to multiple Pivots',
      'Turn off "Autofit column widths on update" in PivotTable Options to maintain layout',
      'Align charts and slicers to cell borders by holding Alt while dragging',
      'You are now 2 weeks in — entering the top 15% of spreadsheet power users'
    ],
    practice: {
      task: 'Build the Week 2 Capstone Sales Report with 3 linked pivot tables and dynamic slicers',
      instructions: [
        'Pivot 1: Revenue by Region; Pivot 2: Top 5 Categories; Pivot 3: Monthly Trend',
        'Connect both pivots to unified Slicers for Fiscal Quarter and Sales Rep',
        'Add a polished Pivot Chart for monthly trends with styled data labels',
        'Save as "Week2_Milestone_SalesReport.xlsx"'
      ],
      sampleData: [
        ['Month', 'Quarter', 'Sales Rep', 'Region', 'Revenue (INR)'],
        ['Jan', 'Q1', 'Priya', 'North', '340000'],
        ['Jan', 'Q1', 'Rohan', 'West', '410000'],
        ['Feb', 'Q1', 'Priya', 'North', '380000'],
        ['Feb', 'Q1', 'Rohan', 'West', '450000'],
        ['Mar', 'Q1', 'Ayesha', 'South', '520000']
      ],
      expectedOutcome: 'A multi-table interactive management dashboard responding to unified slicers.'
    }
  },
  {
    day: 15,
    title: 'Pivot Deep Dive: Calculated Fields & Pivot Charts',
    subtitle: 'Custom formulas inside pivots, calculated items, timelines & advanced design',
    week: 3,
    weekTitle: 'Advanced',
    goals: [
      'Create custom Calculated Fields directly inside a PivotTable (e.g. Profit = Revenue - Cost)',
      'Add Timeline slicers for intuitive date-range dragging (Months, Quarters, Years)',
      'Master "Show Values As" (% Difference From, Running Total in, Difference From)',
      'Style Pivot Charts with bespoke color schemes and minimal editorial chrome'
    ],
    hindi: {
      videoId: 'Bg3F8u7FfLE',
      backups: ['t2RXV91OEHk', 'SA_SDo-cqpg'],
      channel: 'Excel Superstar',
      durationApprox: '40 min'
    },
    english: {
      videoId: '3g1CSG5zvQ0',
      backups: ['F9WgF1K_K2g', 'dvbLrwD2SpA'],
      channel: 'Kevin Stratvert',
      durationApprox: '35 min'
    },
    keyPoints: [
      'PivotTable Analyze -> Fields, Items, & Sets -> Calculated Field to add in-memory formulas',
      'Calculated Fields always evaluate as SUM(Field1) * SUM(Field2), never row-by-row',
      'Timeline Slicers work only when the date column is clean and un-grouped',
      'Use "Show Values As -> % of Parent Row Total" for hierarchical breakdowns'
    ],
    practice: {
      task: 'Build a financial margin model inside a PivotTable using Calculated Fields',
      instructions: [
        'Add Calculated Field: "Gross Profit" = Sales - COGS',
        'Add Calculated Field: "Margin %" = Gross Profit / Sales',
        'Format Margin % as percentage with 1 decimal place',
        'Insert a Timeline Slicer and filter transactions across Q2 and Q3'
      ],
      sampleData: [
        ['Date', 'Channel', 'Units Sold', 'Sales (INR)', 'COGS (INR)'],
        ['2026-04-10', 'Online Store', '120', '240000', '150000'],
        ['2026-05-15', 'Retail Store', '85', '195000', '115000'],
        ['2026-06-20', 'Distributor', '310', '580000', '390000'],
        ['2026-07-08', 'Online Store', '140', '290000', '180000']
      ],
      expectedOutcome: 'A dynamic financial pivot showing calculated gross margins and timeline filters.'
    }
  },
  {
    day: 16,
    title: 'Power Query: Import, Clean & Transform',
    subtitle: 'The modern ETL powerhouse: importing CSVs, unpivoting data, merging & appending',
    week: 3,
    weekTitle: 'Advanced',
    goals: [
      'Open the Power Query Editor (Data -> Get Data)',
      'Import and transform messy CSV and Excel files in repeatable steps',
      'Master Unpivot Columns (turning wide human tables into narrow computer-ready data)',
      'Merge (VLOOKUP on steroids) and Append (stacking monthly files) queries',
      'Automate data refreshes: click "Refresh All" when next month\'s file arrives'
    ],
    hindi: {
      videoId: '09FlqkANCws',
      backups: ['SA_SDo-cqpg', 'ZcAM8uClHGY'],
      channel: 'WsCube Tech',
      durationApprox: '45 min'
    },
    english: {
      videoId: '0aeZX1l4JT4',
      backups: ['x7mzOYEn0XA', 'UAFExySaSPY'],
      channel: 'Kevin Stratvert',
      durationApprox: '45 min'
    },
    keyPoints: [
      'Power Query records every cleaning step in the "Applied Steps" pane like a recipe',
      'Unpivot Columns is the #1 superpower to fix cross-tab reports for PivotTables',
      'Append queries stacks tables vertically; Merge queries joins tables horizontally',
      'Once a Power Query pipeline is built, future updates take exactly one click: Refresh'
    ],
    practice: {
      task: 'Clean a multi-column regional sales report and unpivot months into a clean table',
      instructions: [
        'Load messy data into Power Query via Data -> From Table/Range',
        'Select Region & Rep columns -> Right-click -> Unpivot Other Columns',
        'Rename "Attribute" to "Month" and "Value" to "Sales"',
        'Close & Load into a fresh worksheet and verify the clean tabular output'
      ],
      sampleData: [
        ['Region', 'Rep', 'Jan_Sales', 'Feb_Sales', 'Mar_Sales'],
        ['North', 'Priya', '120000', '145000', '160000'],
        ['South', 'Kiran', '95000', '110000', '125000'],
        ['West', 'Aman', '150000', '140000', '175000']
      ],
      expectedOutcome: 'A normalized 4-column dataset transformed via Power Query without typing formulas.'
    }
  },
  {
    day: 17,
    title: 'What-If Analysis: Goal Seek & Scenario Manager',
    subtitle: 'Reverse engineering targets with Goal Seek, Scenario Manager & Named Ranges',
    week: 3,
    weekTitle: 'Advanced',
    goals: [
      'Use Goal Seek to calculate what input is needed to achieve a desired target output',
      'Name cells and ranges (e.g. TaxRate, LoanAmount) for readable formula syntax',
      'Use Scenario Manager to compare Best Case, Base Case, and Worst Case business models',
      'Build a summary comparison table showing sensitivity across variables'
    ],
    hindi: {
      videoId: 'XBBv2C8L6UY',
      backups: ['ZcAM8uClHGY', 'SA_SDo-cqpg'],
      channel: 'Excel Superstar',
      durationApprox: '35 min'
    },
    english: {
      videoId: 'UD9e-gQCQsE',
      backups: ['hKR8b9YxVzU', 'Y8xhrUa3KH4'],
      channel: 'Kevin Stratvert',
      durationApprox: '35 min'
    },
    keyPoints: [
      'Data -> What-If Analysis -> Goal Seek: Set Cell, To Value, By Changing Cell',
      'Goal Seek can only alter one variable at a time; for multiple variables use Solver',
      'Name Box (top left beside formula bar) lets you instantly name any selected cell',
      'Formula: =Revenue * TaxRate is 10x clearer to read than =$B$4 * $D$12'
    ],
    practice: {
      task: 'Calculate the required sales volume to reach ₹10 Lakh net profit with Goal Seek',
      instructions: [
        'Set up a P&L model: Units * Price - (Units * VariableCost) - FixedOverheads = NetProfit',
        'Use Goal Seek to find how many units must be sold to hit Net Profit = 1,000,000',
        'Create 3 Scenarios in Scenario Manager: Recession, Normal, Boom',
        'Generate a Scenario Summary report'
      ],
      sampleData: [
        ['Parameter', 'Value'],
        ['Unit Price (INR)', '2500'],
        ['Unit Variable Cost', '1100'],
        ['Fixed Monthly Overhead', '450000'],
        ['Units Sold', '400'],
        ['Net Profit (INR)', '=(B2-B3)*B5 - B4']
      ],
      expectedOutcome: 'A Goal Seek solved break-even analysis and an automated Scenario Summary sheet.'
    }
  },
  {
    day: 18,
    title: 'Automation: Record Macros & Intro to VBA',
    subtitle: 'Automate tedious repetitive tasks: Developer tab, recording macros & inspecting VBA',
    week: 3,
    weekTitle: 'Advanced',
    goals: [
      'Enable the Developer tab in Excel Options -> Customize Ribbon',
      'Record a macro to format imported reports with consistent colors, fonts, and totals',
      'Assign the macro to a custom shape button for one-click automation',
      'Press Alt + F11 to inspect the Visual Basic Editor and edit simple values',
      'Save files as Excel Macro-Enabled Workbook (.xlsm)'
    ],
    hindi: {
      videoId: 'Bg3F8u7FfLE',
      backups: ['SA_SDo-cqpg', 'ZcAM8uClHGY'],
      channel: 'Excel Superstar',
      durationApprox: '40 min'
    },
    english: {
      videoId: 'IJQHMFLXk_c',
      backups: ['YWJ1OIfQakQ', 'GzUzEDW6sY0'],
      channel: 'Kevin Stratvert',
      durationApprox: '40 min'
    },
    keyPoints: [
      'Always plan every keystroke before pressing "Record Macro"',
      'Use Relative References button when recording if the macro should run anywhere on the sheet',
      'Macro-enabled workbooks MUST be saved with the .xlsm file extension',
      'Basic VBA: Range("A1").Value = "Bloom Academy" / Selection.Font.Bold = True'
    ],
    practice: {
      task: 'Record a macro that instantly formats any raw table into Bloom editorial style',
      instructions: [
        'Enable Developer Tab and start recording macro named "FormatBloomEditorial"',
        'Apply cream fill, bold dark plum headers, thin borders, and auto-fit column widths',
        'Stop recording and insert a rounded rectangle button labeled "Run Bloom Styling"',
        'Assign your macro to the button and test on raw unformatted data'
      ],
      sampleData: [
        ['id', 'client', 'city', 'amount', 'status'],
        ['101', 'sharma logistics', 'delhi', '45000', 'paid'],
        ['102', 'tata exports', 'mumbai', '98000', 'pending'],
        ['103', 'infosys media', 'bengaluru', '62000', 'paid']
      ],
      expectedOutcome: 'A working one-click macro button that beautifies messy tables automatically.'
    }
  },
  {
    day: 19,
    title: 'Executive Dashboard Architecture',
    subtitle: 'Grid layout, high-impact KPI summary cards, cohesive typography & slicer panels',
    week: 3,
    weekTitle: 'Advanced',
    goals: [
      'Master visual hierarchy: primary metric cards, trend charts, and categorical breakdowns',
      'Build modern rounded KPI cards with large typography and subtle delta indicators',
      'Create a dedicated floating Slicer Control Panel on the left or top',
      'Hide Excel gridlines, formula bar, and headings for an application-grade look'
    ],
    hindi: {
      videoId: 'Bg3F8u7FfLE',
      backups: ['SA_SDo-cqpg', 'ZcAM8uClHGY'],
      channel: 'Excel Superstar',
      durationApprox: '45 min'
    },
    english: {
      videoId: 'Ai0MV7twEBE',
      backups: ['F9WgF1K_K2g', 'k1VUZEVuDJ8'],
      channel: 'Kevin Stratvert',
      durationApprox: '45 min'
    },
    keyPoints: [
      'View -> uncheck Gridlines turns Excel into a clean blank design canvas',
      'Group related KPI cards into a consistent 4-column hero grid at the top',
      'Limit dashboard color palette to 3 colors: Base background, Primary accent, Neutral text',
      'Hold Alt while sizing cards and charts so they snap cleanly to cell borders'
    ],
    practice: {
      task: 'Wireframe and build the editorial dashboard frame with 4 hero KPI cards',
      instructions: [
        'Turn off gridlines and set sheet background to soft cream (#FFF8F4)',
        'Build 4 KPI Cards: Total Revenue, Total Orders, Average Order Value, Customer Rating',
        'Link KPI card values dynamically to underlying calculation cells',
        'Add a dark plum title block: "LUXE RETAIL — EXECUTIVE OVERVIEW"'
      ],
      sampleData: [
        ['Metric', 'Current Value', 'Target', 'Status'],
        ['Gross Revenue', '₹42,85,000', '₹40,00,000', '+7.1%'],
        ['Total Orders', '1,420', '1,250', '+13.6%'],
        ['Avg Order Value', '₹3,017', '₹3,200', '-5.7%'],
        ['CSAT Score', '4.85 / 5.0', '4.50', 'Exceeded']
      ],
      expectedOutcome: 'A sleek, application-style dashboard frame with 4 live KPI metric tiles.'
    }
  },
  {
    day: 20,
    title: 'Capstone: Full Interactive Executive Dashboard',
    subtitle: 'Connecting raw Indian retail sales data into a publication-grade interactive model',
    week: 3,
    weekTitle: 'Advanced',
    goals: [
      'Take raw Indian sales transaction records and build an end-to-end executive cockpit',
      'Connect 4 PivotTables, 2 Pivot Charts, 4 KPI cards, and 3 cross-filtering Slicers',
      'Add regional mapping or geographic breakdowns (North, South, East, West)',
      'Stress test the dashboard: ensure zero formula errors when any slicer combination is clicked'
    ],
    hindi: {
      videoId: 'SA_SDo-cqpg',
      backups: ['Bg3F8u7FfLE', 'ZcAM8uClHGY'],
      channel: 'WsCube Tech',
      durationApprox: '60 min'
    },
    english: {
      videoId: 'Vl0H-qTclOg',
      backups: ['F9WgF1K_K2g', 'dvbLrwD2SpA'],
      channel: 'freeCodeCamp / Chandoo',
      durationApprox: '50 min'
    },
    keyPoints: [
      'Maintain a 3-tab structure: "Data" (raw records), "Calculations" (pivots), "Dashboard" (UI)',
      'Protect worksheet (Review -> Protect Sheet) with no password so users can click slicers without breaking formulas',
      'Save the workbook in both .xlsx and PDF presentation formats',
      'You have now built a portfolio-grade dashboard ready to show clients and employers'
    ],
    practice: {
      task: 'Assemble the final 20-Day Capstone Interactive Dashboard',
      instructions: [
        'Assemble the raw transaction dataset on the Data tab',
        'Build all aggregation pivots on the Calculations tab',
        'Design the final Executive Cockpit on the Dashboard tab with linked slicers',
        'Test clicking through different months and regions — watch all KPI cards update instantly'
      ],
      sampleData: [
        ['Date', 'Region', 'Product Tier', 'Units', 'Revenue (INR)', 'Channel'],
        ['2026-10-01', 'North', 'Premium', '45', '225000', 'Direct'],
        ['2026-10-05', 'South', 'Signature', '28', '196000', 'Online'],
        ['2026-10-12', 'West', 'Classic', '95', '285000', 'Marketplace'],
        ['2026-10-18', 'East', 'Premium', '34', '170000', 'Direct'],
        ['2026-10-25', 'West', 'Signature', '50', '350000', 'Direct']
      ],
      expectedOutcome: 'A complete, portfolio-ready interactive executive dashboard.'
    }
  },
  {
    day: 21,
    title: 'Polish, PDF Export & Graduation',
    subtitle: 'Final touches, locking sheets, exporting pristine PDFs & claiming your Master Gardener seal',
    week: 3,
    weekTitle: 'Advanced',
    goals: [
      'Audit your workbook for orphaned formulas, hidden columns, and formatting inconsistencies',
      'Configure Print Area and Page Setup for flawless single-page PDF exports',
      'Protect worksheet formulas while keeping interactive slicer buttons clickable',
      'Review your 21-day journey from absolute zero to advanced modeling',
      'Claim and download your Bloom Academy "Excel Graduate" Certificate'
    ],
    hindi: {
      videoId: 'ZcAM8uClHGY',
      backups: ['SA_SDo-cqpg', '09FlqkANCws'],
      channel: 'WsCube Tech',
      durationApprox: '35 min'
    },
    english: {
      videoId: 'poM2n8fBcag',
      backups: ['Ai0MV7twEBE', 'k1VUZEVuDJ8'],
      channel: 'Kevin Stratvert',
      durationApprox: '35 min'
    },
    keyPoints: [
      'File -> Export -> Create PDF/XPS generates crisp, vectorized presentation documents',
      'Review -> Check Accessibility to ensure clean screen-reader and contrast compliance',
      'Consistency is a skill: 21 days of daily focused effort compound for a lifetime',
      'Welcome to the top tier of Excel proficiency — you are now fully equipped to conquer any spreadsheet'
    ],
    practice: {
      task: 'Perform the final professional polish and export your Capstone Dashboard to PDF',
      instructions: [
        'Set Print Area specifically to cover your Dashboard boundaries',
        'Export as "Bloom_Capstone_Dashboard_Final.pdf"',
        'Check that all charts and KPI numbers render sharply',
        'Mark Day 21 as complete in Bloom and unlock your Graduation Certificate'
      ],
      sampleData: [
        ['Checklist Item', 'Status', 'Verified'],
        ['All #N/A and #VALUE errors eliminated', 'Complete', 'YES'],
        ['Consistent typography (Playfair/Outfit)', 'Complete', 'YES'],
        ['Unified color palette applied', 'Complete', 'YES'],
        ['Slicers tested across all filter combinations', 'Complete', 'YES'],
        ['Ready for client / leadership presentation', 'Approved', 'YES']
      ],
      expectedOutcome: 'A pristine PDF export and graduation certificate signifying 21 days of excellence.'
    }
  }
];

async function verifyAll() {
  console.log('--- Verifying all 21 Days of Video IDs via YouTube oEmbed API ---');
  let totalChecked = 0;
  let totalValid = 0;
  const invalidList = [];

  for (const day of CURRICULUM_DATA) {
    const hindiTracks = [day.hindi.videoId, ...day.hindi.backups];
    const englishTracks = [day.english.videoId, ...day.english.backups];

    for (const id of hindiTracks) {
      totalChecked++;
      try {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
        if (res.ok) {
          totalValid++;
        } else {
          invalidList.push({ day: day.day, lang: 'hindi', id, status: res.status });
        }
      } catch (e) {
        invalidList.push({ day: day.day, lang: 'hindi', id, error: e.message });
      }
    }

    for (const id of englishTracks) {
      totalChecked++;
      try {
        const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
        if (res.ok) {
          totalValid++;
        } else {
          invalidList.push({ day: day.day, lang: 'english', id, status: res.status });
        }
      } catch (e) {
        invalidList.push({ day: day.day, lang: 'english', id, error: e.message });
      }
    }
  }

  console.log(`Total IDs Checked: ${totalChecked}`);
  console.log(`Total Valid (200 OK): ${totalValid}`);
  if (invalidList.length > 0) {
    console.error(`Invalid IDs (${invalidList.length}):`, invalidList);
    process.exit(1);
  } else {
    console.log('ALL VIDEO IDS ARE 100% VALID AND PUBLIC (200 OK)!');
  }
}

if (process.argv[1] && process.argv[1].endsWith('verify-videos.mjs')) {
  verifyAll();
}

