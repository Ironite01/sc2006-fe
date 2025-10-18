# Remaining Pages to Implement - SC2006 Lab 3

This document outlines all the remaining pages that need to be created for the crowdfunding platform application skeleton.

## ✅ Completed Pages

### User Profile & Rewards
- `src/pages/profile/EditProfile.jsx` - Edit user profile information
- `src/pages/profile/RewardsPage.jsx` - Display rewards by status (Pending/Completed/Redeemed)
- `src/pages/profile/RewardProof.jsx` - Display QR code/proof for completed rewards

### Business Representative
- `src/pages/campaign/components/UpdateComposer.jsx` - Create and publish campaign updates

## 📝 Pages Still Needed

### 1. Business Representative Pages

#### a) Edit Campaign Details (`src/pages/campaign/components/EditCampaignDetails.jsx`)
**Purpose**: Allow business representatives to edit existing campaign information
**Key Features**:
- Pre-populated form with current campaign data
- Fields: campaign name, description, goal amount, end date, reward tiers, images
- Validation for all fields
- "Save" and "Cancel" buttons

**Mock API**: `PUT /api/campaign/:id`

#### b) Manage Rewards (`src/pages/campaign/components/ManageRewards.jsx`)
**Purpose**: View supporters by reward tier and mark rewards as completed
**Key Features**:
- List of reward tiers for the campaign
- For each tier: show pending/completed/redeemed counts
- Click tier to view supporter table (name, email, claim date, status, action button)
- "Mark Completed" button for pending rewards
- Filter by status

**Mock API**: `GET /api/campaign/:id/rewards`, `PUT /api/rewards/:id/status`

#### c) Campaign Comments (`src/pages/campaign/components/CampaignComments.jsx`)
**Purpose**: View and reply to supporter comments on campaign page
**Key Features**:
- Display campaign header (image, name, description, goal, end date)
- List of comments from supporters with profile pictures
- "Reply" button for each comment
- Reply form with text area and "Post Reply" button

**Mock API**: `GET /api/campaign/:id/comments`, `POST /api/campaign/:id/comments/:commentId/reply`

### 2. Supporter Pages

#### a) Updates Page (`src/pages/supporter/UpdatesPage.jsx`)
**Purpose**: View campaign updates from businesses the supporter has donated to
**Key Features**:
- List of update cards showing: campaign image, update title, date, content, like/comment counts
- Email subscription toggle for each campaign
- Filter by campaign
- "Like" and "Comment" buttons

**Mock API**: `GET /api/supporter/updates`

### 3. Administrator Dashboard Pages

#### a) Pending Campaigns (`src/pages/admin/PendingCampaigns.jsx`)
**Purpose**: Review and approve/reject pending campaigns
**Key Features**:
- Table view: Campaign Name, Owner, Date Submitted, Action buttons
- Card view: Campaign preview cards with Approve/Reject buttons
- Click campaign to view full details before approving
- Modal for rejection reason

**Mock API**: `GET /api/admin/campaigns?status=pending`, `POST /api/admin/campaigns/:id/approve`, `POST /api/admin/campaigns/:id/reject`

#### b) Approved Campaigns (`src/pages/admin/ApprovedCampaigns.jsx`)
**Purpose**: View all approved campaigns
**Key Features**:
- Table view: Campaign Name, Owner, Date Approved, Status, View button
- Search and filter by owner or date
- "Suspend" button for policy violations

**Mock API**: `GET /api/admin/campaigns?status=approved`

#### c) Suspended Campaigns (`src/pages/admin/SuspendedCampaigns.jsx`)
**Purpose**: View and manage suspended campaigns
**Key Features**:
- Table view: Campaign Name, Owner, Suspension Reason, Suspended Date
- "Reinstate" button to unsuspend campaigns
- View full campaign details

**Mock API**: `GET /api/admin/campaigns?status=suspended`, `POST /api/admin/campaigns/:id/reinstate`

#### d) Platform Stats (`src/pages/admin/PlatformStats.jsx`)
**Purpose**: View analytics dashboard
**Key Features**:
- Stats cards: Total Campaigns, Total Donations, Net Volume, Total Supporters
- Line graph: Donations Over Time
- Conversion funnel: Campaign Visits → Donations → Platform Revenue
- Campaign status breakdown: Pending/Approved/Rejected/Suspended counts
- Refund rate

**Mock API**: `GET /api/admin/stats`

### 4. Static/Information Pages

#### a) Terms & Conditions (`src/pages/static/TermsAndConditions.jsx`)
**Key Sections**:
- Platform usage terms
- User responsibilities
- Payment terms
- Refund policy
- Liability disclaimers

#### b) FAQ (`src/pages/static/FAQ.jsx`)
**Features**:
- Accordion-style sections
- Categories: General, For Supporters, For Business Representatives, Payments, Rewards
- Each section expands/collapses on click

#### c) About Us (`src/pages/static/AboutUs.jsx`)
**Key Sections**:
- Mission statement
- How the platform works
- Team information (optional)
- Impact metrics

#### d) How It Works (`src/pages/static/HowItWorks.jsx`)
**Features**:
- Step-by-step guide for supporters
- Step-by-step guide for business representatives
- Visual illustrations/icons
- Call-to-action buttons

#### e) Contact Us (`src/pages/static/ContactUs.jsx`)
**Features**:
- Contact form (name, email, subject, message)
- Email: support@platform.com
- FAQ link
- Social media links

## 🛣️ Routes to Add to App.jsx

```javascript
// Profile routes
<Route path="/profile/edit" element={<EditProfile />} />
<Route path="/rewards" element={<RewardsPage />} />
<Route path="/reward/:rewardId" element={<RewardProof />} />

// Business Representative routes
<Route path="/campaign/:id/edit" element={<EditCampaignDetails />} />
<Route path="/campaign/:id/rewards" element={<ManageRewards />} />
<Route path="/campaign/:id/comments" element={<CampaignComments />} />
<Route path="/campaign/updates" element={<UpdateComposer />} />

// Supporter routes
<Route path="/updates" element={<UpdatesPage />} />

// Admin routes
<Route path="/admin/pending" element={<PendingCampaigns />} />
<Route path="/admin/approved" element={<ApprovedCampaigns />} />
<Route path="/admin/suspended" element={<SuspendedCampaigns />} />
<Route path="/admin/stats" element={<PlatformStats />} />

// Static routes
<Route path="/terms" element={<TermsAndConditions />} />
<Route path="/faq" element={<FAQ />} />
<Route path="/about" element={<AboutUs />} />
<Route path="/how-it-works" element={<HowItWorks />} />
<Route path="/contact" element={<ContactUs />} />
```

## 📋 Implementation Checklist

Use this checklist to track your progress:

- [x] EditProfile
- [x] RewardsPage
- [x] RewardProof
- [x] UpdateComposer
- [ ] EditCampaignDetails
- [ ] ManageRewards
- [ ] CampaignComments
- [ ] UpdatesPage
- [ ] PendingCampaigns
- [ ] ApprovedCampaigns
- [ ] SuspendedCampaigns
- [ ] PlatformStats
- [ ] TermsAndConditions
- [ ] FAQ
- [ ] AboutUs
- [ ] HowItWorks
- [ ] ContactUs
- [ ] Update App.jsx with all routes

## 🎨 Design Consistency Guidelines

All pages should follow these design principles from your existing codebase:

### Colors
- Primary Background: `#F5E6D3`
- Card Background: `white`
- Primary Text: `#4A3B2F`
- Secondary Text: `#666`
- Accent Color: `#FF6B35`
- Success Color: `#00B894`
- Error Color: `#F54927`
- Progress Gradient: `linear-gradient(90deg, #FF6B35 0%, #FFB100 100%)`

### Typography
- Headings: Bold, `#4A3B2F`
- Body: Regular, `#666`
- Links: `#FF6B35`, underline on hover

### Components
- Cards: `border-radius: 12px`, `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)`
- Buttons: `border-radius: 6px`, padding `0.75rem 1.5rem`
- Inputs: `border: 1px solid #DDD`, `border-radius: 6px`
- Focus state: `border-color: #FF6B35`

### Spacing
- Section padding: `2rem`
- Card padding: `1.5rem - 2rem`
- Gap between elements: `1rem - 1.5rem`

## 💡 Tips

1. **Reuse Components**: Your Header and Footer are already created. Make sure all pages include them via the routing structure.

2. **Mock Data**: Use placeholder data similar to the patterns in `RewardsPage.jsx` until backend is ready.

3. **Form Validation**: Follow the validation patterns from `EditProfile.jsx` and `Signup.jsx`.

4. **Responsive Design**: Include media queries for mobile (max-width: 768px).

5. **TODO Comments**: Mark areas requiring backend integration with `// TODO: ` comments.

6. **Loading States**: Always include loading states for async operations.

7. **Error Handling**: Use try-catch blocks and display user-friendly error messages.

## 📚 Reference Files

Look at these existing files for patterns:
- **Forms**: `src/pages/signup/index.jsx`, `src/pages/profile/EditProfile.jsx`
- **Data Display**: `src/Home.jsx`, `src/pages/profile/RewardsPage.jsx`
- **Campaign Management**: `src/pages/campaign/components/CampaignManager.jsx`
- **Styling**: Any `.css` file for consistent patterns

Good luck with Lab 3! 🚀
